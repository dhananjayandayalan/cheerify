import { twitterService } from './twitterService';
import { analyzePersonality } from './personalityAnalyzer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export async function generateCheer(username: string): Promise<string> {
    const cleanUsername = username.replace('@', '').trim();

    if (!cleanUsername) {
        throw new Error('Please enter a valid username');
    }

    // Fetch Twitter data
    const userData = await twitterService.getUserData(cleanUsername);

    if (!userData) {
        throw new Error('Failed to analyze profile. The profile might be private, doesn\'t exist, or we couldn\'t access it.');
    }

    if (userData.tweets.length === 0) {
        throw new Error(`@${cleanUsername} has no public tweets to analyze. We need at least a few tweets to create a personalized cheer!`);
    }

    // Analyze personality traits
    const traits = analyzePersonality(userData);

    // Generate unique AI-powered note
    try {
        const response = await fetch(`${BACKEND_URL}/api/generate-note`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                name: userData.name,
                bio: userData.bio,
                tweets: userData.tweets,
                traits: traits
            })
        });

        const data = await response.json();
        return data.note;
    } catch (error) {
        console.error('Error generating AI note:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to generate personalized note. Please try again.');
    }
}
