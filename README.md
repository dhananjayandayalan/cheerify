# Cheerify

A web application that generates personalized cheer-up notes for Twitter users by analyzing their Twitter personality and creating custom PDF messages.

## Features

- **Personalized Notes**: Analyzes Twitter user's tweets and bio to generate personalized, uplifting messages
- **Beautiful PDFs**: Creates professionally formatted PDF notes with custom layout
- **Dark/Light Mode**: Toggle between light and dark themes
- **Typewriter Effect**: Animated text display for a delightful user experience
- **Twitter Integration**: Fetches real tweets to understand personality traits

## How It Works

1. Enter a Twitter handle
2. The app fetches the user's recent tweets and bio (if API is configured)
3. Analyzes their personality traits (technical, creative, helpful, humorous, etc.)
4. Generates a personalized note based on their unique Twitter presence
5. Display the note with a typewriter effect
6. Download as a beautifully formatted PDF

## Project Setup

### Prerequisites

- Node.js (v20.19.0 or v22.12.0+)
- npm

### Installation

```sh
npm install
```

### Twitter API Configuration (Optional but Recommended)

To enable personalized notes based on actual Twitter data:

1. **Get Twitter API Credentials**:
   - Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
   - Create a new app or use an existing one
   - Navigate to the "Keys and tokens" section
   - Generate a Bearer Token

2. **Configure Environment Variables**:
   - Copy the `.env.example` file to `.env`:
     ```sh
     cp .env.example .env
     ```
   - Open `.env` and add your Twitter Bearer Token:
     ```
     TWITTER_BEARER_TOKEN=your_actual_bearer_token_here
     ```

3. **Without Twitter API**:
   - The app will work without API credentials
   - It will use generic but still personalized template-based messages
   - No Twitter data will be fetched

**Note**: The app uses a backend server to handle Twitter API calls securely. The server runs on port 3001 by default.

### Development

Start both frontend and backend servers:

```sh
npm run dev
```

This will start:
- Frontend (Vite): `http://localhost:5173`
- Backend (Express): `http://localhost:3001`

Or run them separately:
```sh
npm run dev:client  # Frontend only
npm run dev:server  # Backend only
```

### Production Build

Type-Check, Compile and Minify for Production:

```sh
npm run build
```

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next generation frontend tooling
- **html2pdf.js** - High-quality HTML to PDF conversion with emoji support

### Backend
- **Express** - Web server framework
- **Twitter API v2** - Fetch user data and tweets
- **Node.js** - JavaScript runtime

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## License

MIT

---

Made with ♥️ by Dhanan
