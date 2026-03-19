# Pattern Coach - Deployment Guide

## Quick Start

### Backend (Render.com)

1. **Push to GitHub**
   - Use "Save to GitHub" in Emergent chat

2. **Create Render Service**
   - Go to https://dashboard.render.com
   - New → Web Service
   - Connect your GitHub repo
   - Select the `backend` folder as root directory

3. **Set Environment Variables** on Render:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/pattern_coach
   DB_NAME=pattern_coach
   JWT_SECRET=your-super-secret-key-here
   EMERGENT_LLM_KEY=sk-emergent-your-key-here
   ```

4. **Deploy**
   - Render auto-deploys from `render.yaml`
   - Health check: `https://your-app.onrender.com/api/health`

---

### Frontend (Expo)

1. **Update Backend URL**
   Edit `/frontend/.env` for production:
   ```
   EXPO_PUBLIC_BACKEND_URL=https://your-render-app.onrender.com
   ```

2. **Build for App Stores**
   ```bash
   # Install EAS CLI
   npm install -g eas-cli
   
   # Login to Expo
   eas login
   
   # Build for iOS
   eas build --platform ios
   
   # Build for Android
   eas build --platform android
   ```

3. **Submit to Stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

---

## Required Accounts

| Service | Purpose | URL |
|---------|---------|-----|
| MongoDB Atlas | Database | https://cloud.mongodb.com |
| Render | Backend hosting | https://render.com |
| Expo | Mobile builds | https://expo.dev |
| Apple Developer | iOS App Store | https://developer.apple.com |
| Google Play Console | Android Store | https://play.google.com/console |

---

## Environment Variables Reference

### Backend (Required)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://...` |
| `DB_NAME` | Database name | `pattern_coach` |
| `JWT_SECRET` | Token signing secret | Random 32+ char string |
| `EMERGENT_LLM_KEY` | AI integration key | `sk-emergent-...` |

### Frontend (Required)
| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_BACKEND_URL` | API endpoint | `https://api.yourapp.com` |

---

## Post-Deployment Checklist

- [ ] Backend health check returns 200
- [ ] Can create new account
- [ ] Can login with existing account
- [ ] Pattern camera AI analysis works
- [ ] Root Detective loads words
- [ ] Avatar customization saves
- [ ] Trial subscription active for new users

---

## Monitoring

- **Render Logs**: Dashboard → Your Service → Logs
- **MongoDB**: Atlas → Clusters → Metrics
- **Expo**: expo.dev → Project → Builds

---

## Troubleshooting

**API returns 500 errors**
- Check Render logs for Python errors
- Verify MONGO_URL is correct
- Verify JWT_SECRET is set

**AI pattern analysis fails**
- Check EMERGENT_LLM_KEY is valid
- Check Emergent dashboard for key balance

**Mobile app can't connect**
- Verify EXPO_PUBLIC_BACKEND_URL in build
- Check CORS is enabled (it is by default)
- Try rebuilding with `eas build`

---

*Generated: March 2025*
