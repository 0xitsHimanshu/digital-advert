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

### 4.4 Firestore (services & orders)

The API server uses **Cloud Firestore** (via Firebase Admin) for:

| Collection | Purpose |
|------------|---------|
| `services/{serviceId}` | Service catalog (title, price, images) |
| `customers/{uid}` | Profile fields (name, phone, email, address) |
| `customers/{uid}/orders/{orderId}` | Orders for that user only (`customerId` = Firebase uid / JWT `sub`) |

On first server start, the `services` collection is **seeded automatically** if it is empty. You can also run:

```powershell
cd apps\server
bun run seed:firestore
```

Deploy rules and indexes (once per Firebase project):

```powershell
npx -y firebase-tools@latest deploy --only firestore:rules,firestore:indexes
```

Completed orders shown in **My Orders** come from `GET /api/payments/orders` and only return documents under the signed-in user's `customers/{uid}/orders` path.

---

## 5. Build the Android development app (one time, or after native changes)

The mobile app uses a **development build** (not Expo Go), because it includes Firebase native code.

### 5.1 Windows paths (important)

This app uses **New Architecture** (Reanimated / Worklets). Android codegen **cannot mix two Windows drive letters** (e.g. `M:\` from `subst` and `C:\` from the real path). If you see `this and base files have different roots`, you mixed paths — see [Troubleshooting](#android-codegen-different-roots-m-vs-c).

**Recommended:** clone or work from a **short path on `C:`** only (no `subst`):

```text
C:\dev\digital-advert-p1
```

Enable long paths (once, as Administrator):

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name LongPathsEnabled -Value 1 -PropertyType DWORD -Force
```

> Avoid `subst M:` for this repo unless **every** command (install, prebuild, Gradle, Metro, Cursor terminal) uses `M:\` only. Opening the project from `C:\` while building on `M:\` causes codegen failures.

Set Java for this terminal session:

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

### 5.2 Install Expo dev client & generate Android project

```powershell
cd C:\Users\Himanshu\Desktop\client-dev\digital-advert-p1\apps\mobile
.\scripts\verify-android-build-path.ps1
bun expo install expo-dev-client
bun expo prebuild --platform android --clean
```

Use **your** repo path instead of the example `C:\Users\...` line if different.

### 5.3 Build and install on the emulator

1. Open **Android Studio** → **Device Manager** → start your emulator (e.g. **Medium_Phone_API_36.1**).

2. Build and run (first time can take **10–15 minutes**):

   ```powershell
   cd C:\Users\Himanshu\Desktop\client-dev\digital-advert-p1\apps\mobile\android
   .\gradlew.bat app:assembleDebug -x lint -x test
   ```

3. Install the APK on the running emulator:

   ```powershell
   $env:Path = "$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:Path"
   adb install -r -d android\app\build\outputs\apk\debug\app-debug.apk
   ```

**Shortcut (build + install in one step)** — from `apps\mobile` (same path as prebuild):

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

**Windows:** set Java, then start Metro from the **same** repo path you used for `prebuild` (do not mix `M:\` and `C:\`):

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:Path"
cd C:\Users\Himanshu\Desktop\client-dev\digital-advert-p1\apps\mobile
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

## 7.1 Razorpay (Cart → Pay now)

Payments need Razorpay test keys on the **server** and a **native dev client** rebuild after installing `react-native-razorpay`.

1. In `apps/server/.env` (see `apps/server/.env.example`):

   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret
   ```

2. Optional in `apps/mobile/.env` (public key id only):

   ```env
   EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   ```

3. Rebuild the dev client (not Expo Go). After adding `react-native-razorpay`, you must regenerate native projects:

   ```powershell
   cd apps/mobile
   npx expo prebuild --clean
   npx expo run:android
   ```

   If Pay now shows *"Cannot read property 'open' of null"*, the Razorpay native module is not in your current build — run the commands above and open the newly installed app (not Expo Go).

4. On the cart screen, tap **Pay now** → Razorpay checkout → on success you land on the order confirmation screen.

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

### Android codegen: `different roots` (`M:\` vs `C:\`) {#android-codegen-different-roots-m-vs-c}

Gradle sees codegen under `M:\node_modules\...` but native modules under `C:\Users\...\node_modules\...`. That happens when the repo is opened or prebuilt on **`C:`** but `bun expo run:android` runs from **`M:`** (or the reverse).

**Fix (use one path only):**

```powershell
# 1) Remove subst drive if you used it
subst M: /D

# 2) From the REAL repo path on C: (adjust to your machine)
cd C:\Users\Himanshu\Desktop\client-dev\digital-advert-p1

bun install

cd apps\mobile
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue
.\scripts\verify-android-build-path.ps1
bun expo prebuild --platform android --clean
bun expo run:android
```

Always run **prebuild**, **Gradle**, and **Metro** from the same `apps\mobile` directory. Do not build from `M:\` if Cursor or a terminal used `C:\` for prebuild.

### Android build fails: `ninja: manifest 'build.ninja' still dirty` or path too long

Symptom in the log:

```
ninja: error: Stat(...RNCSafeAreaViewShadowNode.cpp.o): Filename longer than 260 characters
```

Cause: the React Native New Architecture codegen embeds the **full absolute source path twice** inside `apps\mobile\android\app\.cxx\...`. With the repo at `C:\Users\<name>\Desktop\client-dev\digital-advert-p1\…`, the resulting object-file paths exceed Windows `MAX_PATH` (260). Enabling `LongPathsEnabled=1` alone is not enough because the ninja shipped with the NDK's bundled CMake 3.22 is not long-path-aware.

**Recommended (production-grade) fix — use the wrapper script:**

```powershell
cd C:\Users\Himanshu\Desktop\client-dev\digital-advert-p1\apps\mobile
bun run android:win:prebuild
```

`scripts/build-android.ps1` will:

1. Set `JAVA_HOME` to Android Studio's bundled JBR for this session.
2. Run `verify-android-build-path.ps1` to enforce a single drive root (no `C:\` ↔ subst mixing) and warn on long paths.
3. Run `expo prebuild --platform android --clean` (when `-Prebuild` is passed).
4. Patch the generated `apps/mobile/android/app/build.gradle` to add CMake argument **`-DCMAKE_OBJECT_PATH_MAX=200`**. This makes CMake replace any object-file path longer than 200 chars with a short hashed name, so ninja never has to `Stat` a path that exceeds `MAX_PATH`. The patch is idempotent and re-applied on every prebuild.
5. Run `expo run:android` (or `gradlew app:assembleDebug` with `-SkipRun`).
6. Tee the full output to `apps/mobile/logs/android-build-<timestamp>.log`.

> Note: do **not** use `subst` to "shorten" the repo path. Windows/Node/Java's `realpath`/`canonicalPath` resolves a subst drive back to its underlying `C:\…` path, which causes the React Native autolinker to report `this and base files have different roots` and fail codegen. `CMAKE_OBJECT_PATH_MAX` hashing is the correct fix.

Subsequent rebuilds without regenerating native folders:

```powershell
bun run android:win
```

**One-time admin tweaks (recommended on every Windows dev box):**

```powershell
# As Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name LongPathsEnabled -Value 1 -PropertyType DWORD -Force
git config --system core.longpaths true
```

| Other fixes | Action |
|-------------|--------|
| Use hoisted install | Keep `bunfig.toml` with `linker = "hoisted"`, then `bun install` from project root |
| Short clone path | Clone into `C:\dev\digital-advert-p1` so the wrapper isn't required |
| Clean native build | From `apps\mobile` → delete `android` → `bun run android:win:prebuild` |

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
| Rebuild Android APK | `cd apps\mobile\android` → `.\gradlew.bat app:assembleDebug -x lint -x test` |
| Install APK on emulator | `adb install -r -d apps\mobile\android\app\build\outputs\apk\debug\app-debug.apk` |
| Verify one Windows path | `cd apps\mobile` → `.\scripts\verify-android-build-path.ps1` |
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
