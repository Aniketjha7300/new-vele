# Vele - Deployment Guide

Complete guide to deploy Vele chat application to GitHub, Vercel (Frontend), and Render (Backend).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Setup](#github-setup)
3. [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
4. [Render Deployment (Backend)](#render-deployment-backend)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- MongoDB Atlas account (free tier available)
- Node.js 18+ installed locally
- Git installed locally

---

## GitHub Setup

### Step 1: Initialize Git Repository

```bash
# Navigate to project root
cd C:\Users\Aniket\Desktop\vele

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Vele chat application"
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `vele` (or your preferred name)
4. Description: "Vele - Anonymous video chat application"
5. Set to **Public** or **Private** (your choice)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### Step 3: Push to GitHub

```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/vele.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Vercel Deployment (Frontend)

### Step 1: Create Vercel Configuration

Create `vercel.json` in the **root directory**:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "client/$1"
    }
  ]
}
```

### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository (`vele`)
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `client`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)
5. Click **"Deploy"**

### Step 3: Set Environment Variables

After initial deployment, go to **Settings → Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-render-app.onrender.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@vele.com
```

> **Note:** Replace `your-render-app.onrender.com` with your actual Render backend URL after deployment.

### Step 4: Redeploy

After setting environment variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**

Your frontend will be live at: `https://your-app.vercel.app`

---

## Render Deployment (Backend)

### Step 1: Create Render Configuration

Create `render.yaml` in the **root directory**:

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

### Step 2: Deploy via Render Dashboard

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (`vele`)
4. Configure service:
   - **Name:** `vele-server`
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for 24/7 uptime)

5. Click **"Create Web Service"**

### Step 3: Set Environment Variables

Go to **Environment** tab and add:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
CLIENT_URL=https://your-app.vercel.app
ADMIN_EMAIL=admin@vele.com
RAZORPAY_KEY_ID=rzp_test_RbyWJZ2AuFx14P
RAZORPAY_KEY_SECRET=Rij2nEV7N4YX9Ab0MHDa55zl
```

> **Important:** Replace placeholder values with your actual credentials.

### Step 4: Deploy

1. Render will automatically start building
2. Monitor the build logs
3. Once deployed, your backend will be live at: `https://vele-server.onrender.com`

---

## Environment Variables

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://vele-server.onrender.com` |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket server URL | `https://vele-server.onrender.com` |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Admin email address | `admin@vele.com` |

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT secret key (min 32 chars) | `your-secret-key-here` |
| `CLIENT_URL` | Frontend URL | `https://your-app.vercel.app` |
| `ADMIN_EMAIL` | Admin email | `admin@vele.com` |
| `RAZORPAY_KEY_ID` | Razorpay key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | `...` |

---

## Post-Deployment Configuration

### 1. Update Frontend Environment Variables

After Render deployment, update Vercel environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update:
   ```
   NEXT_PUBLIC_API_URL=https://vele-server.onrender.com
   NEXT_PUBLIC_SOCKET_URL=https://vele-server.onrender.com
   ```
3. Redeploy in Vercel

### 2. Update Backend CORS

Update `server/src/index.ts` to allow your Vercel domain:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}))
```

Then commit and push:
```bash
git add server/src/index.ts
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy on push.

### 3. MongoDB Atlas Configuration

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Add Render IPs or use `0.0.0.0/0` (allows all IPs - for development only)
5. For production, add Render's specific IP ranges (check Render documentation)

### 4. Test Deployment

1. **Frontend:** Visit `https://your-app.vercel.app`
2. **Backend API:** Test `https://vele-server.onrender.com/api/health` (if endpoint exists)
3. **WebSocket:** Test Socket.IO connection in browser console
4. **Authentication:** Test login/register flow
5. **Video Chat:** Test matchmaking and video chat functionality

---

## Troubleshooting

### Render Free Tier Limitations

- **Sleep after inactivity:** Service sleeps after 15 minutes of inactivity
- **Cold start:** First request after sleep takes 30-60 seconds
- **Solution:** Upgrade to paid plan for 24/7 uptime

### WebSocket Connection Issues

- Ensure Socket.IO is configured for production
- Check CORS settings allow your Vercel domain
- Verify environment variables are set correctly

### MongoDB Connection Errors

- Check MongoDB Atlas IP whitelist includes Render IPs
- Verify `MONGODB_URI` is correct in Render environment variables
- Check MongoDB Atlas cluster is running

### Build Failures

**Vercel:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally

**Render:**
- Check build logs in Render dashboard
- Ensure `package.json` scripts are correct
- Verify TypeScript builds successfully: `cd server && npm run build`

### Environment Variable Issues

- Ensure all `NEXT_PUBLIC_*` variables are set in Vercel
- Verify backend variables are set in Render
- Check variable names match exactly (case-sensitive)
- Redeploy after adding/updating variables

### CORS Errors

- Verify frontend URL is in backend CORS allowed origins
- Check `CLIENT_URL` in Render matches Vercel URL
- Ensure credentials are enabled in CORS config

---

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Render web service created and deployed
- [ ] Frontend environment variables set in Vercel
- [ ] Backend environment variables set in Render
- [ ] CORS updated in backend code
- [ ] Frontend environment variables updated with Render URL
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Test frontend deployment
- [ ] Test backend API endpoints
- [ ] Test WebSocket connections
- [ ] Test authentication flow
- [ ] Test video chat functionality

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Socket.IO Deployment](https://socket.io/docs/v4/deployment-guide/)

---

## Support

For issues or questions:
1. Check deployment logs in Vercel/Render dashboards
2. Review browser console for frontend errors
3. Check server logs in Render dashboard
4. Verify all environment variables are set correctly

---

**Last Updated:** 2024
**Version:** 1.0.0

