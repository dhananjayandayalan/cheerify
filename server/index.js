import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Initialize Gemini AI client
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const geminiModel = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' }) : null;

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting: Track concurrent requests
const MAX_CONCURRENT_REQUESTS = 20;
let activeRequests = 0;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting middleware
const rateLimitMiddleware = (req, res, next) => {
    if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
        return res.status(429).json({
            error: 'Too many concurrent requests',
            message: `The server is currently handling ${MAX_CONCURRENT_REQUESTS} requests. Please try again in a moment.`,
            activeRequests,
            maxRequests: MAX_CONCURRENT_REQUESTS
        });
    }
    next();
};

// Request counter middleware
const requestCounterMiddleware = (req, res, next) => {
    activeRequests++;
    console.log(`Active requests: ${activeRequests}/${MAX_CONCURRENT_REQUESTS}`);

    // Decrease counter when response finishes
    res.on('finish', () => {
        activeRequests--;
        console.log(`Request completed. Active requests: ${activeRequests}/${MAX_CONCURRENT_REQUESTS}`);
    });

    next();
};

// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        scrapingEnabled: true,
        aiEnabled: !!geminiModel
    });
});

// Helper function to scrape Twitter profile
async function scrapeTwitterProfile(username) {
    let browser = null;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080'
            ]
        });

        const page = await browser.newPage();

        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Navigate to Twitter profile
        const profileUrl = `https://x.com/${username}`;
        await page.goto(profileUrl, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for profile header to load
        await page.waitForSelector('[data-testid="UserName"]', { timeout: 10000 });

        // Scroll down to trigger tweet loading
        await page.evaluate(() => {
            window.scrollBy(0, 500);
        });

        // Wait for tweets to load (multiple strategies)
        try {
            // Wait for at least one tweet to appear
            await page.waitForSelector('[data-testid="tweetText"]', { timeout: 8000 });
        } catch (e) {
            // If no tweets found immediately, scroll more and wait again
            await page.evaluate(() => {
                window.scrollBy(0, 800);
            });
            await page.waitForTimeout(2000); // Give extra time for lazy loading
        }

        // Extract profile data
        const profileData = await page.evaluate(() => {
            // Get name
            const nameElement = document.querySelector('[data-testid="UserName"]');
            const name = nameElement?.textContent?.split('@')[0]?.trim() || '';

            // Get bio
            const bioElement = document.querySelector('[data-testid="UserDescription"]');
            const bio = bioElement?.textContent?.trim() || '';

            // Get tweets
            const tweetElements = document.querySelectorAll('[data-testid="tweetText"]');
            const tweets = Array.from(tweetElements)
                .slice(0, 10)
                .map(tweet => tweet.textContent?.trim() || '')
                .filter(text => text.length > 0);

            return { name, bio, tweets };
        });

        await browser.close();
        return profileData;
    } catch (error) {
        await browser?.close();
        throw error;
    }
}

app.get('/api/twitter/user/:username', rateLimitMiddleware, requestCounterMiddleware, async (req, res) => {
    try {
        const { username } = req.params;
        const cleanUsername = username.replace('@', '');

        console.log(`Scraping profile for @${cleanUsername}...`);

        const profileData = await scrapeTwitterProfile(cleanUsername);

        if (!profileData.name && profileData.tweets.length === 0) {
            return res.status(404).json({
                error: 'User not found or profile is private',
                message: `Could not access data for @${cleanUsername}. The profile might be private or doesn't exist.`
            });
        }

        res.json({
            username: cleanUsername,
            name: profileData.name || cleanUsername,
            bio: profileData.bio,
            tweets: profileData.tweets
        });
    } catch (error) {
        console.error('Twitter scraping error:', error);

        if (error.message.includes('timeout')) {
            return res.status(408).json({
                error: 'Request timeout',
                message: 'Failed to load the Twitter profile. Please try again.'
            });
        }

        res.status(500).json({
            error: 'Failed to fetch Twitter data',
            message: 'Could not analyze this profile. Please ensure the username is correct and the profile is public.'
        });
    }
});

// AI-powered note generation endpoint
app.post('/api/generate-note', rateLimitMiddleware, requestCounterMiddleware, async (req, res) => {
    if (!geminiModel) {
        return res.status(503).json({
            error: 'AI service not configured',
            message: 'Please set GEMINI_API_KEY in .env file'
        });
    }

    try {
        const { username, name, bio, tweets, traits } = req.body;

        // Build a comprehensive prompt for the AI
        const prompt = `You are a thoughtful friend writing personalized encouragement notes. Your notes are warm, genuine, and make people feel seen and appreciated.

Write a heartfelt, personalized encouragement note for a Twitter user.

User Information:
- Username: @${username}
- Name: ${name || username}
- Bio: ${bio || 'Not provided'}
- Recent tweets sample: ${tweets.slice(0, 5).join(' | ')}

Personality Analysis:
- Positive sentiment: ${traits.isPositive ? 'Yes' : 'No'}
- Humorous: ${traits.isHumorous ? 'Yes' : 'No'}
- Technical/Developer: ${traits.isTechnical ? 'Yes' : 'No'}
- Creative: ${traits.isCreative ? 'Yes' : 'No'}
- Helpful/Supportive: ${traits.isHelpful ? 'Yes' : 'No'}
- Main topics: ${traits.topTopics.join(', ') || 'General'}
- Tone style: ${traits.toneStyle}

Task: Write a unique, genuine, and personalized encouragement note (3-5 sentences) that:
1. Addresses them by their name (${name || username})
2. References specific aspects of their personality or content based on the analysis
3. Feels warm, authentic, and uplifting
4. Matches their tone style (${traits.toneStyle})
5. Is NOT generic - make it feel personally written for them
6. Avoid clichés and overused phrases
7. Don't mention that you're an AI or that this is generated

Write ONLY the note itself, nothing else. No meta-commentary.`;

        console.log(`Generating AI note for @${username} using Gemini...`);

        const result = await geminiModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 1.0, // Higher temperature for more creativity and uniqueness
                maxOutputTokens: 300,
                topP: 0.95,
                topK: 40
            }
        });

        const response = await result.response;
        const generatedNote = response.text().trim();

        res.json({
            note: generatedNote
        });
    } catch (error) {
        console.error('AI generation error:', error);

        if (error.message?.includes('quota') || error.message?.includes('429')) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'Too many requests. Please try again in a moment.'
            });
        }

        res.status(500).json({
            error: 'Failed to generate note',
            message: error.message || 'AI service temporarily unavailable'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Web Scraping: Enabled ✅`);
    console.log(`🤖 AI Generation (Gemini): ${geminiModel ? 'Enabled ✅' : 'Disabled ❌ (Set GEMINI_API_KEY)'}`);
});
