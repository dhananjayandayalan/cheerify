import express from 'express';
import cors from 'cors';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Twitter client
let twitterClient = null;
if (process.env.TWITTER_BEARER_TOKEN && process.env.TWITTER_BEARER_TOKEN !== 'your_bearer_token_here') {
    twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
}

// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        twitterApiConfigured: !!twitterClient
    });
});

app.get('/api/twitter/user/:username', async (req, res) => {
    if (!twitterClient) {
        return res.status(503).json({
            error: 'Twitter API not configured',
            message: 'Please set TWITTER_BEARER_TOKEN in .env file'
        });
    }

    try {
        const { username } = req.params;
        const cleanUsername = username.replace('@', '');

        // Fetch user info
        const user = await twitterClient.v2.userByUsername(cleanUsername, {
            'user.fields': ['description', 'name']
        });

        if (!user.data) {
            return res.status(404).json({
                error: 'User not found',
                message: `Twitter user @${cleanUsername} not found`
            });
        }

        // Fetch recent tweets
        const tweets = await twitterClient.v2.userTimeline(user.data.id, {
            max_results: 10,
            exclude: ['retweets', 'replies'],
            'tweet.fields': ['text']
        });

        const tweetTexts = tweets.data.data?.map(tweet => tweet.text) || [];

        res.json({
            username: cleanUsername,
            name: user.data.name,
            bio: user.data.description || '',
            tweets: tweetTexts
        });
    } catch (error) {
        console.error('Twitter API Error:', error);

        if (error.code === 429) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'Twitter API rate limit reached. Please try again later.'
            });
        }

        res.status(500).json({
            error: 'Failed to fetch Twitter data',
            message: error.message || 'Unknown error occurred'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Twitter API: ${twitterClient ? 'Configured ✅' : 'Not configured ❌'}`);
});
