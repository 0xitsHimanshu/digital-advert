# Development setup guide

This guide explains how to run the **Digital Advert** project on your computer for development: the **mobile app** (Android), the **API server**, and the **web app**.

Written for beginners — follow the steps in order.

---

## What you are running (simple overview)

| Part | What it is | Where it runs |
|------|------------|---------------|
| **Mobile app** | The phone app (sign up, OTP, home screens) | Android emulator or a real phone |
| **API server** | Backend that verifies OTP and issues login tokens | Your PC at `http://localhost:4000` |
| **Web app** | Admin/marketing website (optional for mobile testing) | Your PC at `http://localhost:3000` |
| **Metro** | Serves JavaScript to the mobile app while you code | Your PC at `http://localhost:8081` |

**Important:** For phone sign-in to work, the **API server must be running** while you use the mobile app.

---

## 1. Install required software (one time)

Install these on your PC before anything else:

1. **[Node.js](https://nodejs.org/)** (LTS version, 18 or newer)
2. **[Bun](https://bun.sh/)** — package manager used by this project  
   After install, open a new terminal and check:
   ```powershell
   bun --version
   ```
3. **[Android Studio](https://developer.android.com/studio)** — includes the Android emulator and build tools  
   During setup, install:
   - Android SDK
   - At least one **Virtual Device** (AVD), e.g. **Medium Phone API 36**

4. **Git** (if you clone the repo from GitHub)

### Optional but recommended (Windows only)

- Set **JAVA_HOME** so Android builds work from any terminal:
  - Variable: `JAVA_HOME`
  - Value: `C:\Program Files\Android\Android Studio\jbr`
  - Add `%JAVA_HOME%\bin` to your **Path** (User environment variables)

---

## 2. Get the project on your machine

```powershell
cd C:\Users\YourName\Desktop\client-dev
git clone <your-repo-url> digital-advert-p1
cd digital-advert-p1
```

If you already have the folder, just open a terminal there:

```powershell
cd C:\Users\Himanshu\Desktop\client-dev\digital-advert-p1
```

---

## 3. Install dependencies (one time per machine)

From the **project root** (the folder that contains `apps`, `package.json`, and `bunfig.toml`):

```powershell
bun install
```

> **Note:** This repo uses a `bunfig.toml` setting (`linker = "hoisted"`) so Android native builds work on Windows. Do not remove that file.

---

## 4. Firebase & server configuration (one time)

The mobile app uses **Firebase** for SMS OTP. The server uses a **Firebase Admin** key to verify users after OTP.

### 4.1 Two different Firebase files (do not mix them up)

| File | Used by | Where to get it |
|------|---------|-----------------|
| `apps/mobile/google-services.json` | **Mobile app only** | Firebase Console → Project settings → Your apps → Android → download `google-services.json` |
| Service account JSON (e.g. `digital-ad-c1a35-firebase-adminsdk-….json`) | **Server only** | Firebase Console → Project settings → **Service accounts** → **Generate new private key** |

**Do not** put `google-services.json` inside the server `.env` file.  
**Do not** commit the service account JSON to Git (it is secret).

### 4.2 Mobile: place `google-services.json`

Put the file here (replace if you download a new one):

```
apps/mobile/google-services.json
```

The Android package name in Firebase must be: `com.digitaladvert.mobile`

### 4.3 Server: create `.env`

```powershell
cd apps\server
copy .env.example .env
notepad .env
```

Fill in:

1. **JWT secrets** — any long random strings (keep them secret):
   ```
   JWT_ACCESS_SECRET=your-long-random-string-here
   JWT_REFRESH_SECRET=another-long-random-string-here
   ```

2. **Firebase Admin** — save the downloaded service account JSON in `apps/server/`, for example:
   ```
   apps/server/digital-ad-c1a35-firebase-adminsdk-fbsvc-80956f627c.json
   ```

   In `.env`, point to that file (use your real filename):
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./digital-ad-c1a35-firebase-adminsdk-fbsvc-80956f627c.json
   ```

   Leave `FIREBASE_SERVICE_ACCOUNT_JSON` **empty** unless you know you need it. Using the file path is simpler and safer.

3. Save `.env` and go back to the project root:
   ```powershell
   cd ..\..
   ```

---

## 5. Build the Android development app (one time, or after native changes)

The mobile app uses a **development build** (not Expo Go), because it includes Firebase native code.

### 5.1 Windows: use a short drive letter (recommended)

Long folder paths on Windows can break Android builds. Map the project to drive `M:` for builds:

```powershell
subst M: C:\Users\Himanshu\Desktop\client-dev\digital-advert-p1
```

> Replace the path with **your** actual project path. Run `subst M:` again each time you restart the PC (mapping is not permanent).

Set Java for this terminal session:

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

### 5.2 Install Expo dev client & generate Android project

```powershell
cd M:\apps\mobile
bun expo install expo-dev-client
bun expo prebuild --platform android --clean
```

### 5.3 Build and install on the emulator

1. Open **Android Studio** → **Device Manager** → start your emulator (e.g. **Medium_Phone_API_36.1**).

2. Build and run (first time can take **10–15 minutes**):

   ```powershell
   cd M:\apps\mobile\android
   .\gradlew.bat app:assembleDebug -x lint -x test
   ```

3. Install the APK on the running emulator:

   ```powershell
   $env:Path = "$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:Path"
   adb install -r -d M:\apps\mobile\android\app\build\outputs\apk\debug\app-debug.apk
   ```

**Shortcut (build + install in one step)** — from `M:\apps\mobile`:

```powershell
bun expo run:android
```

You only need to **rebuild the APK** when you change native code, `app.json` plugins, or add packages with native modules. Normal JavaScript/UI changes do **not** need a rebuild.

---

## 6. Daily development — what to run every day

You usually need **two terminal windows**.

### Terminal A — API server (+ optional web)

From the **project root**:

```powershell
cd C:\Users\Himanshu\Desktop\client-dev\digital-advert-p1
bun dev
```

You should see something like:

- `[server] listening on http://localhost:4000`
- Web (optional): `http://localhost:3000`

Keep this terminal open.

### Terminal B — Mobile app (Metro)

**Windows:** map drive and set Java if you use `M:` for builds:

```powershell
subst M: C:\Users\Himanshu\Desktop\client-dev\digital-advert-p1 2>$null
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:Path"
cd M:\apps\mobile
bun expo start --dev-client
```

> Use **`bun expo`**, not `npx expo`, so the correct Expo SDK version is used.

### Start the emulator & open the app

1. Start the emulator in Android Studio (Device Manager).
2. Connect the emulator to Metro:

   ```powershell
   adb reverse tcp:8081 tcp:8081
   ```

3. Open the app **“mobile”** on the emulator (the dev client you installed).
4. If it asks for a URL, it should use `http://localhost:8081` automatically after `adb reverse`.

**Reload after code changes:** press `r` in the Metro terminal, or shake the emulator → **Reload**.

---

## 7. Test phone sign-up / OTP

1. Confirm **Terminal A** shows the server running on port **4000**.
2. On the emulator, go through **Sign up** or **Login** → enter phone → **Verify OTP**.
3. On Android emulator, the app talks to your PC’s server at `http://10.0.2.2:4000` (handled automatically in code).

If sign-in fails, see [Troubleshooting](#8-troubleshooting) below.

---

## 8. Troubleshooting

### “Could not reach the server. Check your network and API base URL.”

| Check | Action |
|-------|--------|
| Server not running | Run `bun dev` from project root; look for `listening on http://localhost:4000` |
| Emulator | Server must be on your PC; app uses `10.0.2.2` on Android emulator automatically |
| **Physical phone** | Phone and PC must be on the same Wi‑Fi. Create `apps/mobile/.env` with your PC’s IP: `EXPO_PUBLIC_API_URL=http://192.168.x.x:4000` then restart Metro |

### “Firebase Admin failed to initialize… project_id”

You pasted **`google-services.json`** into the server config by mistake.

- Use the **service account** JSON from Firebase → Service accounts → Generate new private key.
- Set `GOOGLE_APPLICATION_CREDENTIALS=./your-service-account-file.json` in `apps/server/.env`.
- Restart the server.

### “Sign-in incomplete” / JWT / 503 from server

- Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set in `apps/server/.env`.
- Restart `bun dev` after changing `.env`.

### Android build fails: `ninja: manifest 'build.ninja' still dirty` or path too long

| Fix | Action |
|-----|--------|
| Use hoisted install | Keep `bunfig.toml` with `linker = "hoisted"`, then `bun install` from project root |
| Short path on Windows | Use `subst M:` and build from `M:\apps\mobile` |
| Clean native build | `cd M:\apps\mobile` → `Remove-Item -Recurse -Force android` → `bun expo prebuild --platform android --clean` |

### `JAVA_HOME is not set`

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

Or set `JAVA_HOME` permanently in Windows Environment Variables.

### `npx expo` errors / wrong Expo version

Always use:

```powershell
bun expo start --dev-client
bun expo run:android
```

### Emulator won’t connect to Metro

```powershell
adb reverse tcp:8081 tcp:8081
adb devices
```

`adb devices` should list `emulator-5554` as `device`.

### Web app error: “Next.js inferred your workspace root…”

Already fixed in `apps/web/next.config.ts`. Pull latest code and run `bun dev` again.

---

## 9. Quick command reference

| Goal | Command (from project root unless noted) |
|------|----------------------------------------|
| Install dependencies | `bun install` |
| Run server + web | `bun dev` |
| Run server only | `cd apps\server` → `bun run dev` |
| Start mobile Metro | `cd apps\mobile` → `bun expo start --dev-client` |
| Rebuild Android APK | `cd M:\apps\mobile\android` → `.\gradlew.bat app:assembleDebug -x lint -x test` |
| Install APK on emulator | `adb install -r -d M:\apps\mobile\android\app\build\outputs\apk\debug\app-debug.apk` |
| Map short drive (Windows) | `subst M: C:\path\to\digital-advert-p1` |
| Port forward Metro | `adb reverse tcp:8081 tcp:8081` |

---

## 10. Project layout (helpful paths)

```
digital-advert-p1/
├── apps/
│   ├── mobile/          # Expo React Native app
│   │   ├── google-services.json    ← Firebase (Android client)
│   │   ├── android/                ← Native Android project (after prebuild)
│   │   └── src/
│   ├── server/          # Express API (port 4000)
│   │   ├── .env                    ← Secrets (not in Git)
│   │   └── *-firebase-adminsdk-*.json  ← Firebase Admin key (not in Git)
│   └── web/             # Next.js (port 3000)
├── bunfig.toml          ← Required for Windows Android builds
├── docs/
│   └── development-setup.md   ← This file
└── package.json
```

---

## 11. Security reminders

- Never commit `apps/server/.env` or Firebase service account JSON files.
- Never share service account keys or JWT secrets in chat or screenshots.
- `google-services.json` is less sensitive but still project-specific — avoid publishing it publicly if possible.

---

## Need help?

1. Read the error in the app alert or the terminal.
2. Find the matching row in [Troubleshooting](#8-troubleshooting).
3. Confirm: server running → emulator running → Metro running → `adb reverse` done.

For native build logs, check `apps/mobile/android` build output or `apps/mobile/faillog.txt` if you saved a log from a failed build.
