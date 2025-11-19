# Quick Start Guide

## Running the App Locally

### Prerequisites
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Dependencies installed (`npm install` in root and `functions/` directories)

### Start Development (2 Terminals Required)

#### Terminal 1: Firebase Emulators
```bash
npm run emulators:start
```

Wait for this message:
```
✔  All emulators ready! It is now safe to connect your app.
```

#### Terminal 2: Next.js Dev Server
```bash
npm run dev
```

### Access the App
- **App**: http://localhost:3000 (or port shown in Terminal 2)
- **Emulator UI**: http://localhost:4000

## Troubleshooting

### "Page not available offline" or 500 errors
**Cause**: Firebase emulators are not running

**Solution**: 
1. Check Terminal 1 - are the emulators still running?
2. If not, restart them: `npm run emulators:start`
3. Refresh your browser

### Navigation doesn't work after code changes
**Cause**: Next.js dev server needs to restart to pick up new routes

**Solution**:
1. In Terminal 2, press Ctrl+C to stop the dev server
2. Run `npm run dev` again
3. Refresh your browser

### Port already in use
**Cause**: Previous instance still running

**Solution**:
```bash
# Find and kill process on port 3000 (Next.js)
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 5001 (Firebase Functions)
lsof -ti:5001 | xargs kill -9
```

### Functions not loading
**Cause**: Functions need to be compiled

**Solution**:
```bash
cd functions
npm run build
cd ..
# Then restart emulators
```

## Navigation Guide

### Keyboard Shortcuts
- **0-9**: Enter page numbers (3 digits)
- **Enter**: Navigate to entered page
- **Arrow Up/Down**: Next/previous page in sequence
- **Arrow Left/Right**: Back/forward in history
- **R/G/Y/B**: Red/Green/Yellow/Blue Fastext buttons
- **F1-F10**: Quick access to favorite pages

### Example Navigation
1. Type `1` `1` `1` - Navigates to page 111 (Coming Soon)
2. Type `1` `0` `0` - Returns to index page 100
3. Press `R` - Navigate to red button link (usually News)
4. Press Left Arrow - Go back to previous page

## Key Pages
- **100**: Main Index
- **200**: News Index
- **300**: Sports Index
- **400**: Markets Index
- **500**: AI Oracle
- **600**: Games Index
- **700**: Settings
- **999**: Help

## Development Tips

### Keep Both Terminals Visible
Use a terminal multiplexer like tmux or split your terminal window so you can see both services running.

### Watch for Errors
- Terminal 1 shows Firebase Function errors
- Terminal 2 shows Next.js build errors
- Browser console shows client-side errors

### Hot Reload
- Next.js automatically reloads on file changes
- Firebase Functions automatically reload on changes
- No need to restart unless you see errors

## Need Help?

See full documentation:
- [README.md](./README.md) - Complete project documentation
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [NAVIGATION_FIX.md](./NAVIGATION_FIX.md) - Navigation troubleshooting
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
