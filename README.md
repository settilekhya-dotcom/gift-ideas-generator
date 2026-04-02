# 🧭 Gift Compass (The Gift Brief)

**Find gift ideas that actually feel like them.**  
Most gift recommendation apps give you a "shopping list." We give you a "compass."

Gift Compass helps you navigate the complex emotional landscape of gifting by moving from vague thoughts to a structured, thoughtful decision. 

---

## ✨ Features

- **Personalized Recipient Profiling:** Deep dive into personality, interests, relationship context, and shared memories.
- **AI-Driven Insights:** Moves beyond generic lists to identify the emotional "essence" of the person.
- **Tailored Gifting Directions:** Explore four distinct paths (Memory-Based, Comfort & Care, Interest-Based, Experience & Shared Moment).
- **Shortlist & Compare:** Compare your favorite directions with AI-assisted scoring (Emotional Fit, Meaningfulness, etc.) to land on the winner.
- **Interactive Gift Brief:** A clear, motivating summary of why the direction works, what to look for, and what to avoid.
- **Personalized Note Generator:** Draft a heartfelt card note that naturally weaves in your shared memories.

---

## 🛠 Tech Stack

- **Frontend:** Vanilla JS / HTML5 / CSS3 (No heavy frameworks, purely reactive via a custom store).
- **Logic:** Functional component architecture with a hash-based SPA router.
- **AI Engine:** Powered by **Google Gemini 1.5 Flash** for high-speed, empathetic JSON completion.
- **State:** Centralized pub/sub state manager (Store) for reactive UI updates.
- **Styling:** Custom CSS design system with a focus on rich, premium typography (Fraunces & Inter) and subtle micro-animations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Click the ⚙️ icon in the app header to save your Gemini API Key.

---

## 📂 Project Structure

- **`src/core/`**: The brain of the app. Houses the router, state store, AI api layer, and decision engines.
- **`src/pages/`**: Single-page application views (Home, Input, Insights, Ideas, Compare, Brief, Card).
- **`src/components/`**: Reusable UI units like the Header, Loaders, and Progress indicators.
- **`src/utils/`**: Shared constants, prompt templates, and localStorage persistence.
- **`src/styles/`**: Modular CSS architecture for clean separation of design concerns.

---

## 🎨 Design Philosophy
The UI is inspired by modern editorial design — prioritizing air, elegant typography, and a "slow" animation style that makes the AI processing feel thoughtful rather than robotic.

---

*Built with ❤️ to make gifting feel human.*
