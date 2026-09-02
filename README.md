# Student Career OS 🚀

A modern, production-ready web application built for college students to discover career-building events (hackathons, AI summits, workshops, competitions, webinars), take a 10-question aptitude assessment, and receive personalized certification recommendations.

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router, React 18, Server Components & Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Cloud Firestore
- **Database Access**: Firebase Admin SDK (Server-Side Only via Next.js Route Handlers)
- **Authentication**: NextAuth.js (Credentials Provider with bcrypt password hashing)
- **Validation**: Zod
- **Local Dev Emulators**: Firebase Emulator Suite

---

## 📋 Features

1. **Landing Page**: Modern hero section, feature breakdown, how-it-works workflow, stats counter.
2. **Event Calendar (Public)**: Filterable list of 19+ upcoming events sorted by date, with type/mode dropdowns and live search.
3. **Event Detail Page**: Full description, start/end timestamps, organizer, location, tags, and direct registration links.
4. **Authentication**: Email & Password registration/login storing users securely in Firestore with hashed passwords.
5. **Aptitude Test (Protected)**: 10 multiple-choice questions with progress bar, previous/next controls, and validation.
6. **Scoring Engine**: Evaluates answers across 8 interest categories, handles ties within 1 point, fetches matching certifications sorted by level (Beginner → Intermediate → Advanced), and saves session-scoped submissions to Firestore.
7. **Results Page**: Displays top career match and detailed certification cards with direct links.
8. **Student Profile**: Shows account info, past aptitude test history, and retake CTA.

---

## 🚀 Quick Start Guide

### 1. Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Firebase CLI** (`npm install -g firebase-tools`)

---

### 2. Setting Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Name your project (e.g., `student-career-os`) and create it.
3. In the Firebase left sidebar, navigate to **Build → Firestore Database** and click **Create database**. Select your preferred region and start in **Production Mode**.
4. Go to **Project Settings (⚙️) → Service Accounts**.
5. Click **Generate new private key** to download your service account JSON file.

---

### 3. Environment Configuration

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in `.env.local` with values from your downloaded service account JSON and secret keys:

```env
# Firebase Admin SDK Credentials
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# NextAuth.js Config
NEXTAUTH_SECRET=your-super-secret-32-character-key
NEXTAUTH_URL=http://localhost:3000
```

> **Tip**: To generate a secure `NEXTAUTH_SECRET`, run `openssl rand -base64 32` in your terminal.

---

### 4. Running Local Development

#### Installation

```bash
npm install
```

#### Option A: Running with Firebase Emulator (Recommended for offline dev)

1. Start Firebase Emulators:
   ```bash
   firebase emulators:start
   ```
2. In a separate terminal, seed the emulator with sample data:
   ```bash
   npm run seed:emulator
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

#### Option B: Running against Production Firestore

1. Seed your Firestore cloud instance:
   ```bash
   npm run seed
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 5. Database Schema & Security

All Firestore data access is routed strictly through Next.js Route Handlers using the **Firebase Admin SDK**. Client-side direct access to Firestore is denied by `firestore.rules`:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

#### Collections

- `users`: User accounts (`name`, `email`, `password_hash`, `created_at`).
- `events`: Career events (`title`, `type`, `startDate`, `endDate`, `mode`, `organizer`, `location`, `description`, `tags`, `registrationUrl`).
- `categories`: The 8 core interest categories (`id`, `name`, `description`, `icon`).
- `aptitudeQuestions`: 10 multiple-choice questions with embedded `options` arrays.
- `certifications`: 30+ curated certifications (`name`, `provider`, `level`, `description`, `categoryId`, `url`).
- `aptitudeSubmissions`: Saved test results (`userId`, `submittedAt`, `scores`, `topCategoryIds`, `answers`).

---

### 6. Deploying to Firebase App Hosting

Firebase App Hosting natively supports Next.js App Router applications.

1. Install the latest Firebase CLI:
   ```bash
   npm install -g firebase-tools@latest
   ```
2. Login to Firebase:
   ```bash
   firebase login
   ```
3. Initialize App Hosting in your project root:
   ```bash
   firebase init apphosting
   ```
4. Set secret environment variables in Cloud Secret Manager or Firebase Console:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
5. Deploy to App Hosting:
   ```bash
   firebase apphosting:backend:create
   ```

---

## 🔒 Security Best Practices

- User IDs are **never trusted from client payloads** — they are extracted exclusively from server-verified NextAuth JWT sessions (`auth()`).
- All passwords are encrypted with `bcryptjs` using 12 salt rounds before storage.
- Duplicate email registration is prevented server-side with a 409 Conflict check.
- Aptitude submission details and user profiles are session-scoped and protected against cross-user access.
