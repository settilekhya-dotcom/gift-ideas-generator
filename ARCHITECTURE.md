# 🧭 Project Architecture: Gift Compass

Gift Compass is a high-speed, modern Single-Page Application (SPA) designed to transform user profiling into empathetic gifting insights using AI.

---

## 🏛 Overall Design Pattern
The project follows a **Modified Model-View-Controller (MVC)** architectural pattern, adapted for a lightweight, framework-less frontend:

- **Model (State):** Managed by a centralized `Store` (`src/core/store.js`).
- **View (Presentation):** Functional components in `src/pages/` and `src/components/`.
- **Controller (Router):** A custom hash-based `Router` (`src/core/router.js`).

---

## 🧠 Core Components

### 1. State Management (Pub-Sub Store)
All application data—from user input to AI insights—lives in the **Store**.
- Uses a **publish-subscribe** pattern.
- Allows any component to register listeners for state updates.
- Enables reactive UI updates: when AI data returns, the store triggers a re-render.

### 2. Hash-Based Router
A lightweight, zero-dependency router that handles navigation via URL hashes (`#home`, `#insight`, etc.).
- Manages exit and enter animations.
- Orchestrates asynchronous "onEnter" logic (perfect for triggering AI calls exactly when a page loads).
- Injects HTML strings or DOM elements directly into the main `#app-root`.

### 3. AI Service Layer & Engines
The heavy lifting is offloaded to the **AI Engines** (`src/core/*Engine.js`).
- **Insight Engine:** Generates a core character assessment based on profiling.
- **Direction Engine:** Researches a specific gifting path (Memory, Comfort, etc.).
- **Comparison Engine:** Scores shortlisted directions to find the emotional winner.
- **Note Generator:** Synthesizes a human-like note from the final brief.
- All AI calls are mediated by the **API Service Layer** (`src/core/api.js`), which handles caching, retries, and model fallbacks (using **Gemini 1.5 Flash**).

---

## 🔁 The Journey Flow

1. **Profiling:** The `RecipientInputPage` collects multi-step inputs (Personality, Interests, Relationship, Memory).
2. **Analysis:** The `SummaryDirectionsPage` triggers the AI Insight flow upon entering. It processes the profile and recommends 4 tailored gift directions.
3. **Deep-Dive:** Selecting a direction triggers the `directionEngine`, generating specific ideas and reasoning.
4. **Decision-Making:** Users either select a direction or shortlist multiple for an AI-assisted side-by-side comparison.
5. **Confirmation:** The final decision is locked and converted into a `FinalBrief`.
6. **Celebration:** The `GiftCardPage` generates a celebratory note and an illustrated avatar for the recipient.

---

## 💅 Styling Architecture (Modular CSS)
Styles are fully separated from logic using a modular CSS system found in `src/styles/`.
- **`globals.css`**: Design tokens (HSL colors, fluid spacing, typography).
- **`components.css`**: Atomic UI pieces (Buttons, Cards, Inputs).
- **Page-specific CSS**: Modular files (e.g., `homepage.css`, `ideas.css`) to keep the codebase maintainable as the product grows.

---

## 💾 Persistence
A dedicated **Storage Utility** (`src/utils/storage.js`) ensures that:
1. The user's progress is auto-saved to **LocalStorage** at every step.
2. The journey can survive a page refresh or browser restart.
3. Secure management of the Gemini API Key.
