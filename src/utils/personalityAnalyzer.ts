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

export function generatePersonalizedNote(userData: TwitterUserData, traits: PersonalityTraits): string {
    const { username, name, bio } = userData;
    const displayName = name || username;

    // Build personalized note based on traits
    let note = '';

    // Opening
    if (traits.toneStyle === 'enthusiastic') {
        note += `Hey ${displayName}! `;
    } else if (traits.toneStyle === 'formal') {
        note += `Dear ${displayName}, `;
    } else if (traits.toneStyle === 'thoughtful') {
        note += `Hi ${displayName}, `;
    } else {
        note += `Hey ${displayName}, `;
    }

    // Main content based on personality
    const messages: string[] = [];

    if (traits.isTechnical && traits.topTopics.includes('tech')) {
        messages.push(`Your technical insights and the way you break down complex concepts is truly impressive. The dev community is lucky to have someone who shares knowledge so generously.`);
    }

    if (traits.isCreative && traits.topTopics.includes('design')) {
        messages.push(`Your creative vision and aesthetic sense really shine through in everything you share. You have a unique eye for design that inspires others.`);
    }

    if (traits.isHelpful) {
        messages.push(`The way you support and uplift others in the community doesn't go unnoticed. Your willingness to help and share your knowledge makes Twitter a better place.`);
    }

    if (traits.isPositive) {
        messages.push(`Your positive energy is contagious! You have this wonderful ability to find the bright side and spread joy through your tweets.`);
    }

    if (traits.isHumorous) {
        messages.push(`Your sense of humor is fantastic! You know how to make people smile and bring lightness to the timeline.`);
    }

    if (traits.topTopics.includes('business') || traits.topTopics.includes('startup')) {
        messages.push(`Your entrepreneurial journey and the insights you share about building and growing are truly valuable. Keep pushing boundaries!`);
    }

    if (traits.topTopics.includes('writing') || traits.topTopics.includes('education')) {
        messages.push(`Your ability to articulate thoughts and educate others through your words is a gift. You make complex ideas accessible and engaging.`);
    }

    // If no specific traits matched, use a general compliment based on bio
    if (messages.length === 0) {
        if (bio) {
            messages.push(`I've been following your journey and I'm consistently impressed by your unique perspective. The way you show up authentically on Twitter is refreshing.`);
        } else {
            messages.push(`Your presence on Twitter brings value to the platform. Whether you're sharing thoughts, engaging with others, or just being yourself - it matters.`);
        }
    }

    // Select 1-2 messages
    const selectedMessages = messages.slice(0, Math.min(2, messages.length));
    note += selectedMessages.join(' ');

    // Closing
    if (traits.toneStyle === 'enthusiastic') {
        note += ` Keep being amazing and sharing your light with the world! 🌟`;
    } else if (traits.toneStyle === 'thoughtful') {
        note += ` Continue to be yourself and know that your voice makes a difference.`;
    } else if (traits.toneStyle === 'formal') {
        note += ` Your contributions are valued and appreciated.`;
    } else {
        note += ` Keep shining! ✨`;
    }

    return note;
}
