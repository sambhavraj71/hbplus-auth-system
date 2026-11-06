
# HBPlus Authentication System

A cross-platform authentication application built using **React Native, Expo, React Native Web, and Firebase Authentication**.

The application allows users to sign in using their Google accounts and restricts access exclusively to users with an official `@hbplus.fit` email address.

# HB+ Wellness Platform

## 🌐 Live Demo
🔗 **Netlify Live URL:** https://hbplushauthentication.netlify.app/

---

## 🚀 Features

- Google OAuth 2.0 Authentication
- Official email domain verification
- Restricted access for unauthorized users
- Protected Dashboard
- User profile information
- Logout functionality
- Persistent authentication sessions
- Loading and error handling
- Responsive UI for Web and Mobile
- Cross-platform support (Android, iOS, and Web)

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React Native | UI Development |
| Expo | Cross-platform Development |
| React Native Web | Web Compatibility |
| Firebase Authentication | Google Authentication |
| Firebase Firestore | User Data Storage |
| AsyncStorage | Mobile Session Persistence |
| Netlify | Web Deployment |
| GitHub | Source Code Management |

## 📁 Project Structure

```text
hbplus-auth/
│
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── dashboard.tsx
│   │
│   ├── config/
│   │   └── firebase.js
│   │
│   ├── components/
│   ├── context/
│   ├── services/
│   └── utils/
│
├── assets/
├── app.json
├── package.json
└── README.md
```

*Note: The folder structure will be updated as development progresses.*

## ⚙️ Setup Instructions

### 1. Prerequisites

Install the following tools:

- Node.js
- npm
- Git
- Visual Studio Code

### 2. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd hbplus-auth
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Firebase Configuration

1. Open [Firebase Console](https://console.firebase.google.com/).
2. Create a Firebase project.
3. Register a Web application.
4. Enable Google Authentication under Authentication → Sign-in providers.
5. Add `localhost` to Authorized Domains.
6. Copy your Firebase configuration.

Create the file `src/config/firebase.js`:

```javascript
import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export default app;
```

Replace the placeholder values with your Firebase project configuration.

### 5. Run the Application

Start the development server:

```bash
npx expo start
```

Run on Web:

```bash
npx expo start --web
```

Run on Android:

```bash
npx expo start --android
```

Run on iOS:

```bash
npx expo start --ios
```

*Note: Native Google Sign-In requires an appropriate native development build and OAuth configuration.*

## 🔐 Authentication Flow

The application follows this authentication process:

1. User opens the HBPlus application.
2. User clicks the **Continue with Google** button.
3. Google OAuth authenticates the user.
4. Firebase Authentication returns the authenticated user identity.
5. The application checks the user's verified email address.
6. The email domain is validated against `hbplus.fit`.
7. Authorized users are redirected to the Dashboard.
8. Unauthorized users are signed out and shown an access restriction message.

### Authentication Decision

| Email Address | Result |
|---|---|
| employee@hbplus.fit | Access Allowed |
| admin@hbplus.fit | Access Allowed |
| user@gmail.com | Access Denied |
| user@yahoo.com | Access Denied |

## 🛡️ How Domain Restriction Works

The application only permits users whose verified email address belongs to the official company domain.

**Allowed Domain:**

```text
hbplus.fit
```

### Domain Validation Logic

```javascript
const ALLOWED_DOMAIN = 'hbplus.fit';

export function isAuthorizedEmail(email) {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();

  return normalizedEmail.endsWith(
    `@${ALLOWED_DOMAIN}`
  );
}
```

### Authorization Rules

- Emails ending in `@hbplus.fit` are eligible for access.
- Emails from other domains are rejected.
- Unverified email accounts are rejected.
- Unauthorized users are signed out.
- Dashboard access requires a valid authenticated session.

### Backend Security

Domain validation must not rely exclusively on frontend JavaScript.

Firebase Firestore Security Rules and trusted backend authorization should independently verify:

- Authenticated user identity.
- Verified email status.
- Allowed email domain.
- User-specific access permissions.

This ensures that unauthorized users cannot access protected application data by bypassing frontend restrictions.

## 🔒 Security Considerations

- Firebase Authentication handles Google identity verification.
- Verified email addresses are checked before granting access.
- Protected routes prevent unauthenticated dashboard access.
- Authentication sessions use platform-appropriate persistence.
- Sensitive credentials are never stored in source code.
- Firestore access is restricted using security rules.

## 🌐 Deployment

The Web application can be deployed using Netlify.

### Deployment Steps

1. Push the project to GitHub.
2. Connect the GitHub repository to Netlify.
3. Configure the build command and output directory.
4. Add the deployed domain to Firebase Authorized Domains.
5. Configure the corresponding Google OAuth settings.
6. Deploy and test authentication.

### Build Command

```bash
npx expo export --platform web
```

### Netlify Configuration

| Setting | Value |
|---|---|
| Build Command | `npx expo export --platform web` |
| Publish Directory | `dist` |

## 📌 Project Status

This project is being developed as a cross-platform authentication solution for HBPlus.

Planned deliverables:

- Google Authentication
- Company Domain Restriction
- Protected Dashboard
- Logout Functionality
- Responsive Web and Mobile Support
- GitHub Source Repository
- Netlify Deployment

## 👨‍💻 Author

Developed as part of the HBPlus Cross-Platform Application Assessment.
