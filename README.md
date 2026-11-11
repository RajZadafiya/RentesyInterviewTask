# Rentesy AI Chat & Voice Assistant UI

> Built for the **React Native Mobile Developer, AI Chat UI** interview task at **Rentesy**.

A high-performance, animation-first conversational AI and voice assistant interface engineered in **Expo (React Native 0.88, React 19, Reanimated 4)**. Designed specifically for property managers and tenants to draft messages, resolve maintenance requests, analyze leases, and execute real property actions with fluidity and speed.

---

## ✨ Highlights & Motion Design

Inspired by the design references ([Gleb Kuznetsov's Natural Search Voice Interaction](https://dribbble.com/shots/26722789-Voice-interaction-for-Natural-search-UI-by-Gleb-Kuznetsov) and [AmazingUI's AI Voice Assistant](https://dribbble.com/shots/27123661-AI-Voice-Assistant-by-AmazingUI)):

1. **Fluid Luminescent Voice Assistant (Gleb Kuznetsov & AmazingUI Style)**
   - **Multi-Ring Breathing Aura:** Concentric harmonic circles oscillating with distinct sinusoidal frequencies (`withRepeat`, `withTiming`, `withSpring`).
   - **Dynamic Audio Reactive Waveforms:** Staggered audio frequency bars that respond in real time to speech frequency and volume changes.
   - **Real-Time Word-by-Word Speech Recognition:** Spoken words materialize dynamically with subtle haptic ticks and live state indicators (*Listening → Analyzing → Responding*).

2. **Multi-Stage AI Thinking & Reasoning Indicator**
   - Holographic gradient shimmer animating over a translucent glass surface.
   - Expandable Thought Process drawer with spring physics that exposes the AI's internal reasoning chain step-by-step (e.g. *Retrieving maintenance logs → Checking licensed vendor schedules → Compiling notice*).

3. **Spring-Physics Message Bubbles & Token-by-Token Streaming**
   - Natural bubble ingress transitions (`FadeInDown.springify().damping(16).stiffness(160)`).
   - Realistic token streaming simulation with a pulsating glowing cursor (`▍`) that fades out upon completion.

4. **Actionable Property Management Cards (Rentesy Core Context)**
   - The AI doesn't just chat; it executes real property management actions.
   - **Emergency HVAC Dispatch Notice Card:** Displays unit details, vendor license, proposed time slot, and statutory 24h entry notice.
   - Interactive one-tap **"Confirm & Dispatch Notice"** action with spring compression feedback, haptic response, and animated state transition to *"Dispatched & Synced ✓"*.

5. **Fluid Micro-Interactions & Input Ergonomics**
   - Horizontal suggestion chips with staggered spring ingress.
   - Expanding input bar that dynamically transitions between a glowing microphone button (when empty) and a send button (when text is present).
   - Safe haptic integration with graceful web fallback.

---

## 📁 Project Structure

Organized into a clean, modular architecture:

```
src/
├── components/
│   ├── chat/
│   │   ├── ActionCard.tsx           # Interactive property management dispatch cards
│   │   ├── MessageBubble.tsx        # Message bubbles with spring ingress
│   │   ├── QuickSuggestions.tsx     # Horizontal scrolling quick action chips
│   │   ├── StreamingText.tsx        # Token-by-token streaming with blinking cursor
│   │   └── ThinkingIndicator.tsx    # Multi-stage reasoning drawer with shimmer
│   ├── ui/
│   │   ├── ChatHeader.tsx           # Context header with reset and voice mode toggle
│   │   └── InputBar.tsx             # Multi-line input with dynamic morphing button
│   └── voice/
│       ├── VoiceAssistantOverlay.tsx # Fullscreen ambient voice assistant mode
│       ├── VoiceOrb.tsx             # Luminescent organic pulsating voice orb
│       ├── VoiceTranscript.tsx      # Live transcription & speech status badge
│       └── WaveformBars.tsx         # Multi-frequency audio reactive bars
├── constants/
│   ├── animations.ts                # Spring curves, easings & timing definitions
│   ├── colors.ts                    # Modern dark luxury & AI accent color palette
│   ├── mockData.ts                  # Property management mock conversations & actions
│   └── theme.ts                     # System typography & spacing constants
├── hooks/
│   └── useAIChat.ts                 # Chat lifecycle, streaming, actions & state management
├── navigation/
│   └── routes.ts                    # Route definitions and navigation constants
├── screens/
│   └── AIChatScreen.tsx             # Primary AI Chat & Voice Assistant screen
├── services/
│   └── aiService.ts                 # Realistic streaming & reasoning engine
├── types/
│   └── chat.ts                      # Strict TypeScript types for messages, actions & voice
└── utils/
    └── haptics.ts                   # Cross-platform safe haptic feedback
```

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- Yarn or npm

### 1. Install Dependencies
```bash
yarn install
```

### 2. Run on Web (Browser / Vercel Preview)
```bash
npx expo start --web
```
Press `w` to open in your default browser.

### 3. Run on Mobile (iOS / Android)
```bash
# Start Metro bundler
npx expo start

# Run on iOS Simulator
npx expo run:ios
# or press 'i' in the terminal

# Run on Android Emulator
npx expo run:android
# or press 'a' in the terminal
```

---

## 🧪 Code Quality & Verification

Both linting and TypeScript checks are configured and strictly enforced:

```bash
# TypeScript verification (Zero errors)
npx tsc --noEmit

# ESLint check (Zero warnings, Zero errors)
npx eslint src
```

---

## 🌐 Deploying to Vercel

To export a production web build for Vercel:

```bash
CI=1 EXPO_NO_TELEMETRY=1 npx expo export -p web
```

The output is bundled into the `dist/` folder, ready for instant zero-configuration deployment on Vercel:
- **Framework Preset:** Other / Expo
- **Build Command:** `CI=1 EXPO_NO_TELEMETRY=1 npx expo export -p web`
- **Output Directory:** `dist`

---

## ⚡ Performance Considerations

- **Thread Segregation:** All continuous oscillations (voice orb breathing, audio wave frequency bars, cursor pulsing) run purely on the UI thread via React Native Reanimated worklets, maintaining smooth 60fps/120fps even during heavy React state updates.
- **Micro-Interaction Responsiveness:** Button presses use snappy spring physics (`damping: 18, stiffness: 240`) for immediate tactile feedback.
- **Cross-Platform Compatibility:** Universal code running identically across iOS, Android, and Web with native haptic safeguards.
