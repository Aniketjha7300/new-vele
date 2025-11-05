# 🚀 Vele - Complete Deployment Guide

**A comprehensive step-by-step guide to deploy your Vele chat application to production.**

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Setup](#pre-deployment-setup)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [GitHub Repository Setup](#github-repository-setup)
5. [Backend Deployment (Render)](#backend-deployment-render)
6. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Testing Your Deployment](#testing-your-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Security Best Practices](#security-best-practices)

---

## Prerequisites

Before starting, ensure you have:

- ✅ **GitHub Account** - [Sign up here](https://github.com/signup)
- ✅ **Vercel Account** - [Sign up here](https://vercel.com/signup) (free tier available)
- ✅ **Render Account** - [Sign up here](https://render.com/signup) (free tier available)
- ✅ **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas/register) (free tier available)
- ✅ **Node.js 18+** installed locally
- ✅ **Git** installed locally
- ✅ **Project code** ready and tested locally

---

## Pre-Deployment Setup

### 1. Verify Your Project Structure

Ensure your project has this structure:
```
vele/
├── client/              # Next.js frontend
│   ├── package.json
│   └── src/
├── server/              # Express backend
│   ├── package.json
│   └── src/
├── vercel.json          # Vercel configuration
├── render.yaml          # Render configuration
└── README.md
```

### 2. Test Locally

Before deploying, test your application locally:

```bash
# Terminal 1 - Start Backend
cd server
npm install
npm run dev
# Should start on http://localhost:5000

# Terminal 2 - Start Frontend
cd client
npm install
npm run dev
# Should start on http://localhost:3000
```

Verify:
- ✅ Backend runs on `http://localhost:5000`
- ✅ Health check works: `http://localhost:5000/api/health`
- ✅ Frontend runs on `http://localhost:3000`
- ✅ Authentication works (register/login)
- ✅ Socket.IO connections work (check browser console)
- ✅ Video chat works (WebRTC)
- ✅ Gamification features work (XP, coins, streaks)

---

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a free account
3. Click **"Build a Database"**
4. Choose **"M0 Free"** tier (perfect for development)
5. Select your preferred cloud provider and region
6. Click **"Create"**

### Step 2: Create Database User

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and generate secure password (save it!)
5. Set user privileges to **"Read and write to any database"**
6. Click **"Add User"**

### Step 3: Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. For production: Add Render's IP ranges (see Render documentation)
5. Click **"Confirm"**

### Step 4: Get Connection String

1. Go to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** and version **"5.5 or later"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `vele` (or your database name)

**Example connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vele?retryWrites=true&w=majority
```

**Save this connection string** - you'll need it for Render deployment!

---

## GitHub Repository Setup

### Step 1: Initialize Git (if not done)

```bash
# Navigate to project root
cd C:\Users\Aniket\Desktop\vele

# Check if git is initialized
git status

# If not initialized, run:
git init
```

### Step 2: Verify .gitignore

Your project already has a `.gitignore` file. Verify it includes:

```gitignore
# Dependencies
node_modules/
client/node_modules/
server/node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
client/.env*
server/.env*

# Build outputs
.next/
client/.next/
client/out/
server/dist/
server/build/

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# OS files
.DS_Store
Thumbs.db
*.swp
*.swo

# IDE
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Testing
coverage/
.nyc_output/

# Misc
*.pem
.cache/
temp/
tmp/
```

**Note:** Your `.gitignore` is already properly configured!

### Step 3: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `vele` (or your preferred name)
4. Description: "Vele - Anonymous video chat application"
5. Set visibility: **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### Step 4: Push Code to GitHub

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Vele chat application"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/vele.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Verify:** Your code should now be visible on GitHub!

---

## Backend Deployment (Render)

### Step 1: Verify Render Configuration

Your `render.yaml` should already exist. Verify it contains:

```yaml
services:
  - type: web
    name: vele-server
    env: node
    plan: starter
    buildCommand: cd server && npm install && npm run build
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CLIENT_URL
        sync: false
      - key: ADMIN_EMAIL
        sync: false
      - key: RAZORPAY_KEY_ID
        sync: false
      - key: RAZORPAY_KEY_SECRET
        sync: false
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and **sign in with GitHub**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account (if not connected)
4. Select your repository (`vele`)
5. Configure service settings:
   - **Name:** `vele-server` (or your preferred name)
   - **Environment:** `Node`
   - **Region:** Choose closest to your users (e.g., `Oregon (US West)`)
   - **Branch:** `main`
   - **Root Directory:** Leave empty (we use `cd server` in build command)
   - **Build Command:** `cd server && npm install --include=dev && npm run build` ⚠️ **Important!**
   - **Start Command:** `cd server && npm start`
   - **Plan:** 
     - **Free** - Service sleeps after 15 min inactivity (good for development)
     - **Starter ($7/month)** - 24/7 uptime (recommended for production)
6. Click **"Create Web Service"**

**Note:** The `--include=dev` flag is crucial because TypeScript and type definitions are in devDependencies, but they're needed for the build process even in production mode.

### Step 3: Set Environment Variables

After the service is created, go to **"Environment"** tab and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `5000` | Render will auto-assign, but keep this |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-super-secret-key-min-32-chars` | Generate a strong random string |
| `CLIENT_URL` | `https://your-app.vercel.app` | Update after Vercel deployment |
| `ADMIN_EMAIL` | `admin@vele.com` | Your admin email |
| `RAZORPAY_KEY_ID` | `rzp_test_...` | Your Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | `...` | Your Razorpay secret |

**Generate JWT_SECRET:**
```bash
# On Linux/Mac:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# On Windows PowerShell:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Monitor Deployment

1. Render will automatically start building
2. Watch the **"Logs"** tab for build progress
3. Build should take 2-5 minutes
4. Once deployed, your backend URL will be: `https://vele-server.onrender.com`

**Note:** On free tier, first request after inactivity may take 30-60 seconds (cold start).

### Step 5: Verify Backend Deployment

Your Vele backend has a health endpoint. Test it:

```bash
# Test health endpoint
curl https://vele-server.onrender.com/api/health

# Expected response:
# {"status":"ok","message":"Vele API is running"}
```

Or test in browser:
- Visit: `https://vele-server.onrender.com/api/health`
- Should return: `{"status":"ok","message":"Vele API is running"}`

**Available API Endpoints:**
- `/api/health` - Health check
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/user/profile` - Get/Update user profile
- `/api/subscription/status` - Get subscription status
- `/api/gamification/*` - Gamification endpoints (XP, coins, etc.)
- `/api/chat/*` - Chat endpoints
- `/api/admin/*` - Admin endpoints
- `/api/report/*` - Report endpoints

---

## Frontend Deployment (Vercel)

### Step 1: Verify Vercel Configuration

Your `vercel.json` should already exist. Verify it contains:

```json
{
  "version": 2,
  "framework": "nextjs",
  "rootDirectory": "client"
}
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and **sign in with GitHub**
2. Click **"Add New Project"**
3. Import your GitHub repository (`vele`)
4. Configure project settings:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `client` ⚠️ **Important!**
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)
5. Click **"Deploy"**

### Step 3: Set Environment Variables

After initial deployment, go to **Settings → Environment Variables** and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://vele-server.onrender.com` | Your Render backend URL |
| `NEXT_PUBLIC_SOCKET_URL` | `https://vele-server.onrender.com` | Same as API URL |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `admin@vele.com` | Your admin email |

**Important:** 
- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Never put secrets in `NEXT_PUBLIC_*` variables
- Variables are case-sensitive

### Step 4: Redeploy

After setting environment variables:

1. Go to **Deployments** tab
2. Click the **"..."** menu (three dots) on the latest deployment
3. Select **"Redeploy"**
4. Wait for redeployment to complete

Your frontend will be live at: `https://your-app.vercel.app`

**Note:** Vercel will auto-assign a URL. You can add a custom domain later.

---

## Post-Deployment Configuration

### 1. Update Backend CORS

Update `server/src/index.ts` to allow your Vercel domain. Currently it has:

```typescript
// Line 47-53 in server/src/index.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://vele-nu.vercel.app/'  // Update this with your actual Vercel URL
  ],
  credentials: true
}))
```

**Important:** Remove the trailing slash from the Vercel URL. Update it to:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'  // Replace with your actual Vercel URL (no trailing slash)
  ],
  credentials: true
}))
```

**Note:** Your Socket.IO CORS is already configured to use `CLIENT_URL` environment variable, so it will automatically work once you set the `CLIENT_URL` in Render.

Then commit and push:
```bash
git add server/src/index.ts
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy on push.

### 2. Update Backend CLIENT_URL

1. Go to Render Dashboard → Your Service → Environment
2. Update `CLIENT_URL` with your actual Vercel URL:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Render will automatically redeploy

### 3. Update Frontend API URLs

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` point to your Render backend
3. If needed, update and redeploy

### 4. MongoDB Atlas IP Whitelist (Production)

For production, it's better to whitelist specific IPs:

1. Go to MongoDB Atlas → Network Access
2. Remove `0.0.0.0/0` (if added)
3. Add Render's IP ranges (check [Render documentation](https://render.com/docs/ip-addresses))
4. Or keep `0.0.0.0/0` for development (not recommended for production)

---

## Testing Your Deployment

### 1. Frontend Tests

- [ ] Visit `https://your-app.vercel.app` - should load without errors
- [ ] Check browser console for errors
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test dashboard loads

### 2. Backend Tests

- [ ] Test health endpoint: `https://vele-server.onrender.com/api/health`
- [ ] Test API endpoints:
  - [ ] `/api/auth/register` - User registration
  - [ ] `/api/auth/login` - User login
  - [ ] `/api/user/profile` - Get user profile (requires auth)
  - [ ] `/api/subscription/status` - Get subscription status (requires auth)
- [ ] Check Render logs for errors
- [ ] Verify MongoDB connection in logs

### 3. Integration Tests

- [ ] Register a new user via `/api/auth/register`
- [ ] Login with credentials via `/api/auth/login`
- [ ] Access protected routes (with JWT token)
- [ ] Test user profile endpoint `/api/user/profile`
- [ ] Test subscription status `/api/subscription/status`
- [ ] Test Socket.IO connection (check browser console)
- [ ] Test matchmaking functionality
- [ ] Test video chat (WebRTC)
- [ ] Test gamification features (XP, coins, streaks)
- [ ] Test chat functionality

### 4. WebSocket Connection Test

Open browser console on your frontend (`https://your-app.vercel.app`) and run:

```javascript
// Test Socket.IO connection
// Make sure you've imported socket.io-client in your app
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'https://vele-server.onrender.com');
socket.on('connect', () => console.log('✅ Socket.IO Connected!'));
socket.on('disconnect', () => console.log('❌ Socket.IO Disconnected'));
socket.on('connect_error', (error) => console.error('❌ Connection Error:', error));
```

**Note:** Your project uses Socket.IO for real-time chat and matchmaking. Ensure the connection works before testing video chat features.

---

## Troubleshooting

### Common Issues

#### 1. Render Free Tier - Service Sleeping

**Symptoms:** First request takes 30-60 seconds

**Cause:** Free tier services sleep after 15 minutes of inactivity

**Solutions:**
- Upgrade to paid plan ($7/month) for 24/7 uptime
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your service every 5 minutes
- Accept the cold start delay

#### 2. Build Failures

**Vercel Build Failures:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `client/package.json`
- Verify TypeScript compilation: `cd client && npm run build`
- Check for missing environment variables

**Render Build Failures:**

**TypeScript Type Definition Errors:**
If you see errors like `Could not find a declaration file for module 'express'`:

**Solution:** The issue is that `NODE_ENV=production` causes `npm install` to skip devDependencies, but TypeScript needs the `@types/*` packages for compilation.

1. **Update `render.yaml` build command:**
   ```yaml
   buildCommand: cd server && npm install --include=dev && npm run build
   ```
   This ensures devDependencies (including TypeScript types) are installed during build.

2. **Or update Render dashboard:**
   - Go to Render Dashboard → Your Service → Settings
   - Update Build Command to: `cd server && npm install --include=dev && npm run build`
   - Save and redeploy

**Other Build Issues:**
- Check build logs in Render dashboard
- Verify `server/package.json` has correct scripts:
  - `build`: `tsc` (TypeScript compilation)
  - `start`: `node dist/index.js` (runs compiled code)
- Test build locally: `cd server && npm run build`
- Ensure TypeScript is installed (already in devDependencies)
- Check that `dist/` folder is generated after build
- Verify `server/src/index.ts` compiles without errors

#### 3. CORS Errors

**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solutions:**
- Verify `CLIENT_URL` in Render matches your Vercel URL exactly
- Check `server/src/index.ts` CORS configuration includes your Vercel URL
- Ensure no trailing slashes in URLs
- Check browser console for exact error message

#### 4. MongoDB Connection Errors

**Error:** `MongoNetworkError` or `MongooseServerSelectionError`

**Solutions:**
- Verify `MONGODB_URI` in Render environment variables is correct
- Check MongoDB Atlas Network Access allows Render IPs
- Verify database user credentials are correct
- Check MongoDB Atlas cluster is running (not paused)

#### 5. Environment Variable Issues

**Symptoms:** Variables not working, undefined values

**Solutions:**
- **Frontend:** All variables must start with `NEXT_PUBLIC_` to be accessible in browser
- **Backend:** Variables are case-sensitive
- **Redeploy:** Always redeploy after adding/updating variables
- **Vercel:** Check if variables are set for correct environment (Production/Preview/Development)

#### 6. Socket.IO Connection Issues

**Error:** `WebSocket connection failed` or `Socket.IO connection timeout`

**Solutions:**
- Verify `NEXT_PUBLIC_SOCKET_URL` in Vercel points to Render backend
- Check Socket.IO CORS configuration in `server/src/index.ts` (line 33-39)
- Verify `CLIENT_URL` environment variable in Render matches your Vercel URL
- Your Socket.IO is already configured to use `CLIENT_URL` from environment
- Check Render logs for Socket.IO errors
- Ensure no trailing slash in URLs
- Test connection in browser console (see Testing section)
- Verify your frontend imports `socket.io-client` correctly

#### 7. TypeScript Build Errors

**Error:** Type errors during build

**Solutions:**
- Fix TypeScript errors locally first
- Run `npm run build` locally to catch errors
- Check `tsconfig.json` configuration
- Ensure all types are properly defined

---

## Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use strong, random `JWT_SECRET` (min 32 characters)
- ✅ Rotate secrets regularly
- ✅ Use different secrets for development and production

### 2. MongoDB Atlas

- ✅ Use strong database passwords
- ✅ Limit IP whitelist to specific IPs (not `0.0.0.0/0`)
- ✅ Enable MongoDB Atlas authentication
- ✅ Regularly review database access logs

### 3. API Security

- ✅ Enable rate limiting (already in your code)
- ✅ Use Helmet.js (already in your code)
- ✅ Validate all inputs
- ✅ Sanitize user inputs

### 4. Frontend Security

- ✅ Never expose secrets in `NEXT_PUBLIC_*` variables
- ✅ Use HTTPS only in production
- ✅ Implement proper error handling
- ✅ Validate user inputs on frontend and backend

### 5. Payment Security

- ✅ Use Razorpay test keys for development
- ✅ Switch to production keys only when ready
- ✅ Never expose secret keys in frontend code
- ✅ Implement webhook signature verification

---

## Quick Deployment Checklist

Use this checklist to ensure nothing is missed:

### Pre-Deployment
- [ ] Code tested locally
- [ ] All dependencies installed (`npm install` in both client and server)
- [ ] Backend builds successfully: `cd server && npm run build`
- [ ] Frontend builds successfully: `cd client && npm run build`
- [ ] Local server runs: `cd server && npm run dev` (port 5000)
- [ ] Local client runs: `cd client && npm run dev` (port 3000)
- [ ] Environment variables documented (check `client/env.example` and `server/env.example`)
- [ ] `.gitignore` configured correctly (already done)

### MongoDB Atlas
- [ ] Cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string saved

### GitHub
- [ ] Repository created
- [ ] Code pushed to GitHub
- [ ] `.gitignore` working (no sensitive files committed)

### Backend (Render)
- [ ] Service created
- [ ] Root directory: Leave empty (or set to root, we use `cd server` in commands)
- [ ] Build command: `cd server && npm install --include=dev && npm run build` ⚠️ **Critical!**
- [ ] Start command: `cd server && npm start`
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI` (your MongoDB Atlas connection string)
  - [ ] `JWT_SECRET` (strong random string, min 32 chars)
  - [ ] `CLIENT_URL` (will be updated after Vercel deployment)
  - [ ] `ADMIN_EMAIL=admin@vele.com`
  - [ ] `RAZORPAY_KEY_ID`
  - [ ] `RAZORPAY_KEY_SECRET`
- [ ] Deployment successful
- [ ] Health check passes: `https://vele-server.onrender.com/api/health`
- [ ] Backend URL noted: `https://vele-server.onrender.com`

### Frontend (Vercel)
- [ ] Project created
- [ ] Root directory set to `client` ⚠️ **Critical!**
- [ ] Framework preset: Next.js (auto-detected)
- [ ] Build command: `npm run build` (auto-detected)
- [ ] Environment variables set:
  - [ ] `NEXT_PUBLIC_API_URL` (your Render backend URL)
  - [ ] `NEXT_PUBLIC_SOCKET_URL` (same as API URL)
  - [ ] `NEXT_PUBLIC_ADMIN_EMAIL=admin@vele.com`
- [ ] Deployment successful
- [ ] Redeployed after setting environment variables
- [ ] Frontend URL noted: `https://your-app.vercel.app`

### Post-Deployment
- [ ] Backend CORS updated with Vercel URL
- [ ] Backend `CLIENT_URL` updated
- [ ] Frontend environment variables updated with Render URL
- [ ] MongoDB Atlas IP whitelist configured
- [ ] All functionality tested

### Testing
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Backend health check: `https://vele-server.onrender.com/api/health`
- [ ] No browser console errors
- [ ] Authentication works:
  - [ ] User registration
  - [ ] User login
  - [ ] JWT token stored
- [ ] Socket.IO connects (check browser console)
- [ ] Protected routes work (dashboard, profile, etc.)
- [ ] API endpoints work:
  - [ ] `/api/user/profile`
  - [ ] `/api/subscription/status`
  - [ ] `/api/chat/skip-count`
- [ ] Chat functionality works
- [ ] Video chat works (WebRTC)
- [ ] Gamification features work (XP, coins, streaks)

---

## Additional Resources

### Official Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Socket.IO Deployment](https://socket.io/docs/v4/deployment-guide/)

### Helpful Tools
- [UptimeRobot](https://uptimerobot.com) - Monitor your Render service
- [Postman](https://www.postman.com) - Test API endpoints
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI

---

## Support

If you encounter issues:

1. **Check Logs:**
   - Vercel: Dashboard → Deployments → Select deployment → Logs
   - Render: Dashboard → Your service → Logs

2. **Verify Configuration:**
   - Environment variables are set correctly
   - CORS configuration includes your domains
   - Build commands are correct

3. **Test Locally:**
   - Reproduce the issue locally
   - Check if it's a deployment-specific issue

4. **Common Solutions:**
   - Redeploy after environment variable changes
   - Clear browser cache
   - Check for trailing slashes in URLs
   - Verify all services are running

---

## Deployment URLs Template

After deployment, fill in your URLs:

```
Frontend (Vercel):  https://your-app.vercel.app
Backend (Render):   https://vele-server.onrender.com
MongoDB Atlas:      mongodb+srv://username:password@cluster.xxxxx.mongodb.net/vele?retryWrites=true&w=majority
```

**Save these URLs for reference!**

## Project-Specific Notes

### Your Vele Application Structure

- **Frontend:** Next.js 14 with TypeScript (located in `client/`)
- **Backend:** Express.js with TypeScript (located in `server/`)
- **Database:** MongoDB Atlas
- **Real-time:** Socket.IO for chat and matchmaking
- **Video:** WebRTC for peer-to-peer video chat
- **Payments:** Razorpay integration
- **Authentication:** JWT-based authentication

### Key Features

Your application includes:
- User authentication (register/login)
- Subscription tiers (Free, Premium, Pro)
- Gamification (XP, levels, streaks, coins)
- Real-time anonymous chat matching
- WebRTC video chat
- Admin dashboard
- Report & block system

### Build Process

- **Backend:** TypeScript compiles to `server/dist/` folder
- **Frontend:** Next.js builds to `.next/` folder
- Both projects use npm for package management

### Environment Variables

Your project uses separate environment files:
- `client/.env` or `client/env.example` for frontend
- `server/.env` or `server/env.example` for backend

Make sure to set all required variables in both Vercel and Render!

---

**Last Updated:** 2024  
**Version:** 2.0.0  
**Maintained by:** Vele Team

---

## Need Help?

If you're stuck:
1. Review the troubleshooting section
2. Check deployment logs
3. Verify all configuration steps
4. Test locally first before deploying

**Happy Deploying! 🚀**

