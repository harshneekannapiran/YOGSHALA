# 🚀 YogShala Deployment Guide

## ✅ What's Already Done
- ✅ MongoDB connection configured with your cluster
- ✅ Backend environment variables set
- ✅ Frontend configured for production
- ✅ Build successfully tested
- ✅ Railway CLI installed

## 📊 Your Application Details
- **Backend**: Express + MongoDB + Mongoose
- **Frontend**: React + Vite
- **MongoDB**: `mongodb+srv://harshnee:Harsh@21@cluster0.va8gnjy.mongodb.net/yogshala`

## 🔧 Backend Deployment (Railway)

### Step 1: Auth with Railway
1. Go to [railway.app](https://railway.app)
2. Click "Login" and sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose "Connect GitHub Repository"
6. Select your YogShala repository

### Step 2: Configure Railway
1. Railway will detect your backend automatically
2. Set Root Directory to: `Backend`
3. Add Environment Variables:
   - `MONGODB_URI`: `mongodb+srv://harshnee:Harsh@21@cluster0.va8gnjy.mongodb.net/yogshala?retryWrites=true&w=majority&appName=Cluster0`
   - `PORT`: `5000`
   - `NODE_ENV`: `production`

### Step 3: Deploy
1. Click "Deploy Now"
2. Wait for deployment (2-3 minutes)
3. Railway will give you a URL like: `https://yog-shala-production.railway.app`
4. **⚠️ SAVE THIS URL** - you'll need it for frontend

## 🌐 Frontend Deployment (Netlify)

### Step 1: Build with Backend URL
1. Create `.env.production` file in root:
```bash
VITE_API_URL=https://your-railway-url.railway.app/api
```

2. Build again:
```bash
npm run build
```

### Step 2: Deploy to Netlify
**Option A: Netlify Drop (Easiest)**
1. Go to [netlify.com](https://netlify.com)
2. Drag your `dist` folder to the deploy area
3. Add Environment Variable: `VITE_API_URL=https://your-railway-url.railway.app/api`

**Option B: Git Integration**
1. Push your code to GitHub
2. Connect GitHub to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_API_URL=https://your-railway-url.railway.app/api`

## 🧪 Testing

### Test Backend:
- Visit: `https://your-railway-url.railway.app/api/poses`
- Should show JSON data

### Test Frontend:
- Visit your Netlify URL
- Try creating an account and logging in

## 📱 Your Final URLs
- **Frontend (Netlify)**: `https://yogshala.netlify.app` (or your custom domain)
- **Backend (Railway)**: `https://yog-shala-production.railway.app`
- **API Endpoint**: `https://yog-shala-production.railway.app/api`

## 🛠️ Troubleshooting

### Common Issues:
1. **CORS Error**: Check backend URL in frontend config
2. **MongoDB Connection**: Verify MongoDB cluster allows connections
3. **Build Errors**: Check Node.js version compatibility

### Check Logs:
- Railway: Project → Deployments → View Logs
- Netlify: Site → Functions → View Logs

## 🔄 Updates
To update your app:
1. Make changes locally
2. Push to GitHub (if using Git integration)
3. Rebuild: `npm run build` (for frontend)
4. Redeploy (automatic with Git integration)

---

**Need Help?** Check Railway and Netlify documentation for detailed guides.

