# SneakAI Production Deployment Guide

## 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Add your server IPs (or allow all `0.0.0.0/0`) in Network Access.
3. Create a database user and copy the connection string.
4. Replace `<username>` and `<password>` with your credentials.

## 2. API & AI Services (Render)
1. Push this entire repository to GitHub.
2. Log into [Render](https://render.com) and connect your GitHub account.
3. Navigate to the Render Dashboard > Blueprints > New Blueprint Instance.
4. Select your repository. Render will automatically detect the `render.yaml` file and deploy both `sneakai-api` (Node.js) and `sneakai-ai` (Python) services.
5. In the Render dashboard, go to the `sneakai-api` service settings and add your `MONGODB_URI` environment variable.
6. Once deployed, take note of the two `.onrender.com` URLs generated.

## 3. Frontend (Vercel)
1. Log into [Vercel](https://vercel.com) and click "Add New... Project".
2. Import the `SNEAKER RECOMMEDATION WEBSITE` repository from GitHub.
3. For the "Root Directory", click Edit and select `FRONTEND`.
4. In "Environment Variables", add:
   - `NEXT_PUBLIC_API_URL` = `https://your-api-url.onrender.com`
   - `NEXT_PUBLIC_AI_URL` = `https://your-ai-url.onrender.com`
5. Click "Deploy". The platform will use `vercel.json` to handle peer dependency installations.
6. Once Vercel provides a `.vercel.app` URL, copy it.

## 4. Final Security Link
1. Go back to Render Dashboard -> `sneakai-api` -> Environment.
2. Update the `FRONTEND_URL` to your new Vercel URL (e.g. `https://sneakai-xyz.vercel.app`).
3. Deploy the latest commit.

You are now fully deployed on serverless architecture!
