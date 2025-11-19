import type { TwitterUserData } from './twitterService';

export interface PersonalityTraits {
    isPositive: boolean;
    isHumorous: boolean;
    isTechnical: boolean;
    isCreative: boolean;
    isHelpful: boolean;
    topTopics: string[];
    toneStyle: 'formal' | 'casual' | 'enthusiastic' | 'thoughtful';
}

export function analyzePersonality(userData: TwitterUserData): PersonalityTraits {
    const allText = [...userData.tweets, userData.bio].join(' ').toLowerCase();

    // Detect positive sentiment
    const positiveWords = ['love', 'great', 'awesome', 'amazing', 'wonderful', 'fantastic', 'happy', 'excited', 'grateful', 'thank'];
    const isPositive = positiveWords.some(word => allText.includes(word));

    // Detect humor
    const humorIndicators = ['lol', 'haha', '😂', '😅', '🤣', '😄', 'funny', 'joke', 'ironic'];
    const isHumorous = humorIndicators.some(indicator => allText.includes(indicator));

    // Detect technical content
    const techWords = ['code', 'dev', 'api', 'programming', 'software', 'tech', 'javascript', 'python', 'build', 'deploy', 'database'];
    const isTechnical = techWords.filter(word => allText.includes(word)).length >= 2;

    // Detect creativity
    const creativeWords = ['design', 'create', 'art', 'creative', 'writing', 'story', 'music', 'photo', 'visual', 'aesthetic'];
    const isCreative = creativeWords.some(word => allText.includes(word));

    // Detect helpful nature
    const helpfulWords = ['help', 'share', 'support', 'community', 'learn', 'teach', 'guide', 'tip', 'advice'];
    const isHelpful = helpfulWords.filter(word => allText.includes(word)).length >= 2;

    // Extract top topics (simplified version)
    const topTopics = extractTopics(userData.tweets);

    // Determine tone style
    let toneStyle: 'formal' | 'casual' | 'enthusiastic' | 'thoughtful' = 'casual';
    const exclamationCount = (allText.match(/!/g) || []).length;
    const questionCount = (allText.match(/\?/g) || []).length;

    if (exclamationCount > 5) {
        toneStyle = 'enthusiastic';
    } else if (questionCount > 3 || allText.includes('think') || allText.includes('believe')) {
        toneStyle = 'thoughtful';
    } else if (allText.includes('moreover') || allText.includes('therefore') || allText.includes('furthermore')) {
        toneStyle = 'formal';
    }

    return {
        isPositive,
        isHumorous,
        isTechnical,
        isCreative,
        isHelpful,
        topTopics,
        toneStyle
    };
}

function extractTopics(tweets: string[]): string[] {
    const topics: string[] = [];
    const topicKeywords = {
        'tech': ['code', 'dev', 'programming', 'software', 'tech', 'ai', 'ml'],
        'design': ['design', 'ui', 'ux', 'creative', 'art'],
        'business': ['startup', 'business', 'entrepreneur', 'founder', 'company'],
        'writing': ['writing', 'blog', 'story', 'article', 'content'],
        'education': ['learn', 'teach', 'education', 'student', 'course'],
        'community': ['community', 'people', 'together', 'support', 'help'],
        'life': ['life', 'journey', 'growth', 'mindset', 'motivation']
    };

    const allText = tweets.join(' ').toLowerCase();

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some(keyword => allText.includes(keyword))) {
            topics.push(topic);
        }
    }

    return topics.slice(0, 3); // Return top 3 topics
}

// Note: The generatePersonalizedNote function has been removed.
// We now use AI (OpenAI GPT) to generate unique, personalized notes
// on the backend. See server/index.js /api/generate-note endpoint.
