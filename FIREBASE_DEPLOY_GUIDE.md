# 🚀 Free Deployment Guide for Viki Social using Google Firebase Hosting

This step-by-step guide walks you through deploying your **Viki Social** web application online for **100% free** using **Google Firebase Hosting**.

Once deployed, your app will have a fast, global, secure HTTPS URL (e.g. `https://viki-social.web.app` or `https://<your-project-id>.web.app`) accessible from anywhere in the world on Android, iPhone, Windows, Mac, and Linux.

---

## 💰 Why Firebase Hosting is 100% Free
Firebase's **Spark Plan** is completely free with no credit card required:
- **Free Custom Domain & SSL Certificate** (Automatic HTTPS)
- **10 GB Storage** for web app assets
- **360 MB/day Data Transfer** (~10+ GB per month)
- **Global Google Edge CDN** (High speed worldwide)
- **Built-in Single Page Application (SPA) Routing** & PWA cache support

---

## 📋 Prerequisites
1. A free Google Account (e.g., your Gmail `ranjugattadhar3799@gmail.com`).
2. Node.js (version 18 or higher) installed on your computer.

---

## 🛠️ Step-by-Step Instructions

### Step 1: Open Firebase Console and Create a Free Project
1. Open your browser and go to: **[https://console.firebase.google.com/](https://console.firebase.google.com/)**
2. Sign in with your Google account.
3. Click on **"Add project"** (or **"Create a project"**).
4. Enter a project name, for example: `viki-social` (or `viki-social-app`).
5. (Optional) Disable Google Analytics if prompted (to keep it fast and simple), then click **Create project**.
6. Wait a few seconds until your project is ready, then click **Continue**.
7. Note down your **Project ID** (e.g. `viki-social-12345` shown on the project overview).

---

### Step 2: Install Firebase CLI on Your Computer
Open your terminal (Command Prompt, PowerShell, or macOS/Linux Terminal) and run:

```bash
npm install -g firebase-tools
```

*(If on Linux/Mac and you get permission errors, you can run `sudo npm install -g firebase-tools`)*

---

### Step 3: Log in to Firebase
In your terminal, run:

```bash
firebase login
```

- A browser window will open asking you to sign in with your Google account (`ranjugattadhar3799@gmail.com`).
- Allow the requested permissions.
- Once completed, your terminal will show: `✔ Success! Logged in as your-email@gmail.com`.

---

### Step 4: Link Your Project
In the root directory of this project, run:

```bash
firebase use --add
```

- Select the Firebase project you created in Step 1 from the list.
- When asked for an alias, type `default`.

*(Alternatively, you can just edit `.firebaserc` file in this directory and replace `"viki-social-app"` with your actual Project ID)*.

---

### Step 5: Build and Deploy!
Run the single command:

```bash
npm run deploy
```

*(This automatically builds your production files with `vite build` and deploys them to Firebase Hosting).*

---

### 🎉 Step 6: Access Your Live Public Website
Once the deployment finishes (usually 10-20 seconds), your terminal will print:

```text
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/<your-project-id>/overview
Hosting URL: https://<your-project-id>.web.app
```

Your app is now live with:
- **`https://<your-project-id>.web.app`**
- **`https://<your-project-id>.firebaseapp.com`**

Both URLs work immediately on any mobile phone, tablet, or desktop worldwide with instant HTTPS encryption!

---

## 📱 Installing on Mobile (Android & iOS)
Because **Viki Social** is a fully configured Progressive Web App (PWA):
- On **Android (Chrome)**: Tap the **"Install Viki App"** banner at the top or open Chrome Menu (⋮) and tap **"Install app"** / **"Add to Home screen"**. It installs as a native-feeling standalone app with the custom Viki "V" icon and splash screen.
- On **iPhone (Safari)**: Tap the Share button (square with arrow pointing up) and select **"Add to Home Screen"**.

---

## 🔄 How to Deploy Updates in the Future
Whenever you make changes to your code, simply run:

```bash
npm run deploy
```

Firebase Hosting will instantly update your live site without downtime!
