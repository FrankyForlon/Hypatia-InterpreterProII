# Constance Mobile App - Build Instructions

## Option 1: PWA (Fastest - 2 minutes)

The app is already a PWA. Just open it in Chrome and add to home screen.

**On Android:**
1. Open Chrome
2. Go to https://4id5ijcscnr5a.kimi.page
3. Tap the three dots menu
4. Tap "Add to Home screen"
5. Tap "Add"

**On iPhone:**
1. Open Safari
2. Go to https://4id5ijcscnr5a.kimi.page
3. Tap the Share button (square with arrow)
4. Scroll down and tap "Add to Home Screen"
5. Tap "Add"

The app will appear on your home screen with the green "C" icon and open fullscreen like a native app.

---

## Option 2: Android APK (Real native app)

### Prerequisites
- Node.js (https://nodejs.org) - get LTS version
- Android Studio (https://developer.android.com/studio) - for building
- Java JDK 17

### Step 1: Install Capacitor
```bash
cd constance-mobile
npm install
npx cap add android
```n
### Step 2: Configure Android permissions
The app needs microphone permission. This is already configured in `capacitor.config.json`.

### Step 3: Build the APK
```bash
npx cap sync
npx cap open android
```

This opens Android Studio. From there:
1. Wait for Gradle sync to finish
2. Go to Build → Build Bundle(s) / APK(s) → Build APK(s)
3. Find the APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 4: Install on phone
```bash
# With USB debugging enabled on your phone:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Or email yourself the APK file and open it on your phone (allow "Install from unknown sources" when prompted).

---

## Option 3: Use online build service (No Android Studio needed)

### Using Capacitor + Ionic Appflow (paid) or local build

If you don't want to install Android Studio, you can use:

**Ionic Appflow:** https://ionic.io/appflow (has free tier)
- Upload your code
- Cloud builds the APK
- Download and install

**Alternative: GitHub Actions**
Add `.github/workflows/build.yml` to your repo for automated APK builds on every push.

---

## Notes

- The APK version loads the app from the web URL. For a fully offline version, you'd need to bundle all assets locally (replace the `server.url` in capacitor.config.json with local files).
- The PWA version works offline after first load thanks to the service worker.
- Both versions request microphone permission on first use.

## Troubleshooting

**"App not installed" error**
- Uninstall any previous version first
- Make sure "Install from unknown sources" is enabled

**Microphone doesn't work in APK**
- Go to Phone Settings → Apps → Constance → Permissions → Microphone → Allow
- Restart the app

**APK crashes on open**
- Check that you ran `npx cap sync` after any changes
- Make sure the web URL is accessible
