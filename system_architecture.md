# The Gift Brief — System Architecture

The following diagram illustrates the high-level architecture and data flow of **The Gift Brief** platform. 

```mermaid
graph TD
    subgraph "Frontend (Vanilla JS + Vite)"
        UI["UI Layer (Components & Pages)"]
        Router["Router (_handleRouteChange)"]
        Store["Central Store (Observable State)"]
        Storage["LocalStorage (Journey Persistence)"]
    end

    subgraph "Intelligence & Logic Engines"
        RE["Recipient Engine (Profile Normalization)"]
        DG["Direction Engine (Deep Dives)"]
        IG["Insight Generator (AI Summary)"]
        GG["Gift Note Generator (Personalized Notes)"]
        AG["Avatar Generator (Deterministic SVG)"]
    end

    subgraph "API & External Services"
        GroqAPI["Groq API Entry (api.js)"]
        ModelFallback["Model Fallback Loop (llama-3.3-70b-versatile &rarr; llama-3.1-8b-instant &rarr; mixtral-8x7b-32768)"]
        DiceBear["DiceBear (Character Visuals)"]
    end

    %% Data Flow
    UI --> Router
    Router --> Store
    Store <--> Storage
    
    UI --> RE
    RE --> Store
    
    Store --> IG
    IG --> GroqAPI
    
    Store --> DG
    DG --> GroqAPI
    
    Store --> GG
    GG --> GroqAPI
    
    Store --> AG
    AG --> DiceBear
    AG --> UI

    GroqAPI --> ModelFallback
    ModelFallback --> UI
```

### Architectural Breakdown

#### 1. Core State Management
*   **Central Store**: A singleton object that acts as a single source of truth for the entire application journey (from recipient input to final gift brief).
*   **LocalStorage Persistence**: Every step of the journey is automatically synced to the browser, allowing users to return to their progress at any time.

#### 2. The Multi-Model API Layer (Groq Integration)
*   **Fail-Fast Resilience**: The system implementation of a "Model Fallback" loop. If the primary 70B model encounters a timeout (25s) or a rate limit, it automatically tries smaller, faster models to guarantee a result.
*   **Cleaning Logic**: Raw AI text is processed via regex to extract structured JSON, ensuring the UI never crashes due to conversational "filler."

#### 3. Deterministic Persona Generation
*   **Trait-to-Visual Mapping**: The Recipient Engine normalizes personality traits into a fixed set of categories, which the Avatar Generator uses to determine colors and character styles.
*   **Humanoid Silhouettes**: Gender-based seeding ensures that avatars accurately reflect the "Boy" or "Girl" selection while maintaining a consistent artistic style.

#### 4. Emotional Intelligence Logic
*   **Smart Prompts**: Prompts are dynamically built using "Believability Anchors"—shared memories or specific personality quirks that the AI weaves into its gift notes and insights for high emotional resonance.
