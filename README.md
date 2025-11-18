# Modern Teletext

A modern web application that resurrects classic teletext broadcast technology with contemporary capabilities including live API integrations, AI-powered assistance, and interactive features.

## Project Structure

```
.
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions and Firebase config
│   ├── firebase-client.ts # Firebase client SDK
│   └── firebase-admin.ts  # Firebase Admin SDK
├── functions/             # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts      # Cloud Functions entry point
│   ├── package.json
│   └── tsconfig.json
├── types/                 # TypeScript type definitions
│   └── teletext.ts       # Core teletext types
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── storage.rules          # Storage security rules
└── .env.example          # Environment variables template
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable the following services:
   - Firestore Database
   - Cloud Storage
   - Cloud Functions
   - Firebase App Hosting (optional)
3. Copy `.env.example` to `.env.local` and fill in your Firebase credentials
4. Update `.firebaserc` with your project ID

### 3. Set Up Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase use --add
```

### 4. Run Development Server

```bash
# Start Next.js development server
npm run dev

# In another terminal, start Firebase emulators (optional)
firebase emulators:start
```

### 5. Deploy to Firebase

```bash
# Build the Next.js app
npm run build

# Deploy Cloud Functions
cd functions && npm run deploy && cd ..

# Deploy Firestore rules and indexes
firebase deploy --only firestore,storage
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_FIREBASE_*`: Firebase client configuration
- `FIREBASE_*`: Firebase Admin SDK credentials
- `GOOGLE_CLOUD_*`: Google Cloud/Vertex AI configuration

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Firebase Cloud Functions, Node.js
- **Database**: Firestore (NoSQL)
- **Storage**: Firebase Storage
- **AI**: Google Gemini via Vertex AI
- **Hosting**: Firebase App Hosting

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

Private project
