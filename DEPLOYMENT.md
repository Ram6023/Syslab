# GitHub Pages Deployment Guide

## 🚀 Deploying SysLab to GitHub Pages

### Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/Ram6023/Syslab
2. Click on **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### Step 2: Push Changes

The GitHub Actions workflow will automatically deploy your site when you push to the `main` branch.

```bash
git add .
git commit -m "feat: Add GitHub Pages deployment configuration"
git push origin main
```

### Step 3: Wait for Deployment

- Go to the **Actions** tab in your repository
- Wait for the deployment workflow to complete (usually 2-3 minutes)
- Your site will be live at: **https://ram6023.github.io/Syslab/**

## 🔧 Configuration Details

### Vite Configuration
The `vite.config.ts` has been updated with:
```typescript
base: mode === 'production' ? '/Syslab/' : '/'
```

This ensures all assets are loaded from the correct path when deployed to GitHub Pages.

### GitHub Actions Workflow
Located at `.github/workflows/deploy.yml`, this workflow:
- Triggers on every push to `main`
- Installs dependencies
- Builds the production bundle
- Deploys to GitHub Pages

## 🐛 Troubleshooting

### Blank Page Issue
If you see a blank page:
1. Check that GitHub Pages is enabled in repository settings
2. Verify the workflow completed successfully in the Actions tab
3. Clear your browser cache and hard refresh (Ctrl+Shift+R)

### 404 Errors
If assets are not loading:
1. Ensure the `base` path in `vite.config.ts` matches your repository name
2. Repository name is case-sensitive: `/Syslab/` not `/syslab/`

### Favicon 404
The favicon.ico 404 error is normal and won't affect functionality. To fix it:
1. Add a `favicon.ico` file to the `public` folder
2. Or update `index.html` to reference a different icon

## 📝 Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build the project
npm run build

# The dist folder contains your production build
# You can deploy this folder to any static hosting service
```

## ✅ Verification

Once deployed, verify your site at:
**https://ram6023.github.io/Syslab/**

You should see:
- ✅ SysLab header with gradient text
- ✅ Interactive 3D background boxes
- ✅ All 5 modules working correctly
- ✅ Smooth animations and transitions

