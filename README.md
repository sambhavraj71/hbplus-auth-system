HBPlus Authentication System

A cross-platform authentication application built using React Native, Expo, React Native Web and Firebase Authentication.

The application allows users to sign in using their Google accounts and restricts access exclusively to users with an official @hbplus.fit email address.

🚀 Features
Google OAuth 2.0 Authentication
Official email domain verification
Restricted access for unauthorized users
Protected Dashboard
User profile information
Logout functionality
Persistent authentication sessions
Loading and error handling
Responsive UI for Web and Mobile
Cross-platform support (Android, iOS and Web)
🛠️ Technology Stack
Technology	Purpose
React Native	UI development
Expo	Cross-platform development
React Native Web	Web compatibility
Firebase Authentication	Google authentication
Firebase Firestore	User data storage (optional)
AsyncStorage	Mobile session persistence
Netlify	Web deployment
GitHub	Source code management
📁 Project Structure
text
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


Note: The folder structure will be updated as additional features are implemented.

⚙️ Setup Instructions
1. Prerequisites

Install the following software:

Node.js 24 LTS or compatible version
npm
Git
Visual Studio Code
2. Clone the Repository
bash
git clone YOUR_GITHUB_REPOSITORY_URL


Navigate into the project:

bash
cd hbplus-auth

3. Install Dependencies
bash
npm install

4. Configure Firebase
Visit Firebase Console.
Create a Firebase project.
Register a Web application.
Enable Google Authentication under Authentication → Sign-in providers.
Add localhost to Authorized Domains.
Copy your Firebase configuration.

Create or update src/config/firebase.js:

javascript
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


Use your own Firebase project configuration. Never commit private service-account credentials or OAuth client secrets.

5. Run the Application

Start the Expo development server:

bash
npx expo start


For Web:

bash
npx expo start --web


For Android:

bash
npx expo start --android


For iOS:

bash
npx expo start --ios


Native Google sign-in requires the appropriate native development build and OAuth configuration.

🔐 Authentication Flow

The application follows this authentication process:

User opens the HBPlus application.
User clicks the Continue with Google button.
Google OAuth authenticates the user.
Firebase Authentication returns the authenticated user identity.
The application checks the user's verified email address.
The email domain is validated against hbplus.fit.
Authorized users are redirected to the Dashboard.
Unauthorized users are signed out and shown an access restriction message.
Authentication Decision
Email	Result
employee@hbplus.fit	Access Allowed
admin@hbplus.fit	Access Allowed
user@gmail.com	Access Denied
user@yahoo.com	Access Denied
🛡️ How Domain Restriction Works

The application only permits users whose verified email address belongs to the official company domain.

Allowed domain:

text
hbplus.fit


Example validation logic:

javascript
const ALLOWED_DOMAIN = 'hbplus.fit';

export function isAuthorizedEmail(email) {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();

  return normalizedEmail.endsWith(
    `@${ALLOWED_DOMAIN}`
  );
}

Authorization Rules
Emails ending in @hbplus.fit are eligible for access.
Emails from other domains are rejected.
Unverified email accounts are rejected.
Unauthorized users are signed out.
Dashboard access requires a valid authenticated session.
Backend Security

Domain validation must not rely exclusively on frontend JavaScript.

Firebase Firestore Security Rules and trusted backend authorization should independently verify:

Authenticated user identity.
Verified email status.
Allowed email domain.
User-specific access permissions.

This prevents unauthorized access to protected application data even if someone bypasses the frontend.

🔒 Security Considerations
Firebase Authentication handles Google identity verification.
Email verification is checked before granting access.
Protected routes prevent unauthenticated dashboard access.
Authentication sessions use platform-appropriate persistence.
Sensitive credentials are never stored in source code.
Firestore access is restricted using security rules.
🌐 Deployment

The Web application can be deployed using Netlify.

General deployment process:

Push the project to GitHub.
Connect the GitHub repository to Netlify.
Configure the build command and output directory according to the Expo Web export.
Add the deployed domain to Firebase Authorized Domains.
Configure the corresponding Google OAuth settings.
Deploy and test authentication.

Example Expo Web build:

bash
npx expo export --platform web


Expo generates the static web build in the dist directory.

Netlify configuration:

Build command: `npx expo export --platform
