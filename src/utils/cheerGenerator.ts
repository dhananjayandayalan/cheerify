import { twitterService } from './twitterService';
import { analyzePersonality, generatePersonalizedNote } from './personalityAnalyzer';

const templates = [
    "Hey @{user}, your tweets are like a breath of fresh air on the timeline. Your unique perspective and the way you articulate your thoughts really stand out. Keep being your authentic self! ✨",
    "To @{user}: I've noticed how you always support others in the community. Your kindness doesn't go unnoticed. The world needs more souls like yours. Never forget how awesome you are! 🌟",
    "Dear @{user}, reading your threads is always a highlight of my day. You have a gift for storytelling that captivates everyone. You're doing great, and your voice matters! 🚀",
    "Hello @{user}! Just a reminder that you are capable of amazing things. Your bio says it all - you're here to make a difference. Believe in yourself as much as we believe in you! 💪",
    "@{user}, your energy is infectious! Whether you're sharing wins or learning moments, you inspire those around you. Keep sharing your light with the world! ☀️",
    "Dearest @{user}, your creativity knows no bounds. It's amazing to see how you evolve and grow. Keep pushing boundaries and creating magic! 🎨",
    "Hey @{user}, just wanted to send some good vibes your way. Your presence on this platform makes it a better place. Keep shining bright! 🌈"
];

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function generateFallbackCheer(username: string): string {
    const cleanUsername = username.replace('@', '').trim();
    if (!cleanUsername) return "You are amazing! ❤️";

    const index = hashString(cleanUsername) % templates.length;
    const template = templates[index] ?? templates[0]!;
    return template.replace('{user}', cleanUsername);
}

export async function generateCheer(username: string): Promise<string> {
    const cleanUsername = username.replace('@', '').trim();
    if (!cleanUsername) return "You are amazing! ❤️";

    try {
        // Try to fetch Twitter data
        const userData = await twitterService.getUserData(cleanUsername);

        if (userData && userData.tweets.length > 0) {
            // Analyze personality and generate personalized note
            const traits = analyzePersonality(userData);
            return generatePersonalizedNote(userData, traits);
        }
    } catch (error) {
        console.warn('Could not fetch Twitter data, using fallback:', error);
    }

    // Fallback to template-based approach
    return generateFallbackCheer(cleanUsername);
}

// Keep the sync version for backwards compatibility, but it will use fallback
export function generateCheerSync(username: string): string {
    return generateFallbackCheer(username);
}
