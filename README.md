# Daily Fetal Movement Tracker

A simple React Native (Expo) application that allows users to track daily fetal movements. The app includes Home screen to view past records and Counter screen to track new session. All data is stored locally without any backend.

## Prerequisites

Node.js (v18 or later recommended)
npm or yarn
Expo CLI (via npx expo)
Android Emulator / iOS Simulator / Physical device with Expo Go

## To Run the Project

1. Clone the repository

   ```bash
   git clone <your-github-repo-link>
   cd <project-folder>
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npm start
   ```

4. Run the app

Press a to open in Android Emulator
Press i to open in iOS Simulator (Mac only)
Or scan the QR code using Expo Go on your mobile device

## Libraries Used

1. Expo – React Native framework
2. Expo Router – File-based navigation
3. @react-native-async-storage/async-storage – Local data persistence
4. react-native-safe-area-context – Safe area handling

## Data Structure for Storing Records

1. All sessions are stored locally using AsyncStorage under the key: "sessions"

2. Each record is stored as a structured JSON object:

type Session = {
id: string; // Unique identifier (Date.now().toString())
date: string; // ISO date string
minutes: number; // Duration - minutes
kicks: number; // Total kicks recorded
};

## Data Handling

1. Sessions are saved using JSON.stringify()
2. Sessions are loaded using JSON.parse()
3. Records are sorted by date (latest first)
4. Defensive checks prevent displaying undefined values
5. Data persists after app restart

## Assumptions Made

1. The session is considered complete when the user records 10 kicks.
2. Data is stored locally only (no backend or authentication).
3. Each session is saved manually by pressing the Save button.
4. If the user navigates back without saving, the session is discarded.
5. Duration is stored as minutes and seconds for easier UI rendering.
6. No multi-user support is required.
7. App works in offline mode only.

## Build (Android APK)

To generate an APK using Expo EAS:

eas build -p android --profile preview
