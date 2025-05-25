# Firebase Deployment Guide

This guide will help you deploy your Next.js app to Firebase Hosting.

## Prerequisites

1. **Firebase CLI** (already installed)
2. **Firebase Project** - You need to create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter a project name (e.g., "inverter-webapp")
4. Follow the setup wizard
5. Copy your project ID

### 2. Configure Project

1. Open `.firebaserc` file
2. Replace `"your-firebase-project-id"` with your actual Firebase project ID

```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

### 3. Initialize Firebase (Alternative Method)

If you prefer to use the interactive setup:

```bash
firebase init hosting
```

- Select "Use an existing project"
- Choose your Firebase project
- Set public directory to: `out`
- Configure as single-page app: `Yes`
- Set up automatic builds and deploys with GitHub: `No` (unless you want CI/CD)

## Deployment

### Option 1: Using npm scripts (Recommended)

```bash
# Build and deploy
npm run deploy

# Or deploy only hosting
npm run deploy:hosting
```

### Option 2: Manual deployment

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Project Configuration

The project is configured with:

- **Static Export**: Next.js builds to static files in `out/` directory
- **Image Optimization**: Disabled for static export compatibility
- **Trailing Slash**: Enabled for better Firebase hosting compatibility

## Important Notes

1. **Static Export Limitations**:

   - No server-side features (API routes, middleware, etc.)
   - No image optimization
   - No incremental static regeneration

2. **Routing**: All routes will fallback to `index.html` (SPA mode)

3. **Environment Variables**: Create `.env.local` for local development and add environment variables in Firebase Console for production

## Troubleshooting

### Build Errors

- Check for ESLint errors and fix them
- Ensure all imports are correctly resolved
- Verify TypeScript compilation

### Deployment Issues

- Ensure Firebase project ID is correct in `.firebaserc`
- Verify you have deploy permissions for the Firebase project
- Check that `out/` directory exists after build

### 404 Errors

- Verify `firebase.json` rewrites configuration
- Check that all routes are client-side routes

## Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps

## Next Steps

After successful deployment:

1. Your app will be available at `https://your-project-id.web.app`
2. Set up a custom domain if needed
3. Configure analytics and other Firebase services
4. Set up CI/CD pipeline if desired

## Commands Reference

```bash
# Build project
npm run build

# Deploy everything
npm run deploy

# Deploy only hosting
npm run deploy:hosting

# Preview locally
firebase serve

# View deployment history
firebase hosting:sites:list
```
