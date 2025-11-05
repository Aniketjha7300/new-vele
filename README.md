# 🚀 Vele - Anonymous Random 1:1 Chat & Video

**Tagline:** *"Meet, Match, and Talk – The Future of Random Connections"*

## 📋 Project Overview

Vele is a modern Omegle-style platform for anonymous random 1:1 chat & video with:
- **Account-based system** (all users must register)
- **Anonymous chat** (users never see each other's real identities)
- **Subscription tiers** (Free, Premium $4.99/month, Pro $9.99/month)
- **Gamification** (XP, levels, streaks, coins, mini-games)
- **AI-powered moderation** (free/local models)
- **Cyberpunk/futuristic UI**

## 🏗️ Project Structure

```
vele/
├── client/          # Next.js frontend
├── server/          # Node.js/Express backend
└── README.md
```

## 🚀 Quick Start

### Client (Frontend)
```bash
cd client
npm install
npm run dev
```

### Server (Backend)
```bash
cd server
npm install
npm run dev
```

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Real-time:** Socket.IO (chat), WebRTC (video)
- **Payments:** Stripe/Razorpay
- **Video:** STUN/TURN (Coturn)

## 📝 Features

### Free Tier
- Random 1:1 text & video chat (anonymous)
- Limited skips per day (5)
- AI-generated avatar + random nickname
- Daily login rewards (coins)

### Premium Tier ($4.99/month)
- Unlimited skips
- Region & gender filters
- HD video + AI background blur
- Private invite-only rooms
- Verified badge

### Pro Tier ($9.99/month)
- Everything in Premium
- AI Mood Match
- Real-time subtitles (offline models)
- Priority matching with other Pro users
- Extra cosmetic perks

## 🔒 Security & Privacy

- End-to-end encryption for video & audio (WebRTC)
- Captcha + rate-limiting
- Report & block system
- Age verification
- No storage of private messages/video (only moderation logs)

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed installation instructions.

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Start server (Terminal 1)
cd server && npm run dev

# Start client (Terminal 2)
cd client && npm run dev
```

## 📋 Features

### ✅ Implemented
- Account system with JWT authentication
- Subscription tiers (Free, Premium, Pro)
- Real-time anonymous chat matching (Socket.IO)
- WebRTC video chat
- Gamification (XP, levels, streaks, coins)
- Spin the wheel mini-game
- AI moderation (profanity filtering)
- Admin dashboard
- Cyberpunk-themed UI

### 🚧 TODO
- Payment integration (Stripe/Razorpay)
- Social login (Google, GitHub)
- More mini-games
- AI Mood Match feature
- Real-time subtitles
- Email verification
- Rate limiting & CAPTCHA

## 📄 License

MIT

