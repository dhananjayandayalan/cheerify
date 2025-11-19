export interface TwitterUserData {
    username: string;
    name: string;
    bio: string;
    tweets: string[];
}

class TwitterService {
    private backendUrl: string;

    constructor() {
        this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    }

    async getUserData(username: string): Promise<TwitterUserData | null> {
        try {
            const cleanUsername = username.replace('@', '');

            const response = await fetch(`${this.backendUrl}/api/twitter/user/${cleanUsername}`);

            if (!response.ok) {
                if (response.status === 503) {
                    console.warn('Twitter API not configured on backend');
                    return null;
                }
                if (response.status === 404) {
                    console.warn(`User @${cleanUsername} not found`);
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching Twitter data:', error);
            return null;
        }
    }
}

export const twitterService = new TwitterService();
