/**
 * The Gift Brief — Gemini API Layer
 * Handles all communication with the Google Gemini API
 */

import store from './store.js';

const GEMINI_API_BASES = [
  'https://generativelanguage.googleapis.com/v1beta/models',
  'https://generativelanguage.googleapis.com/v1/models'
];
const DEFAULT_MODEL = 'gemini-1.5-flash';
const MODEL_FALLBACKS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash'
];
const MAX_429_RETRIES = 2;
const RESPONSE_CACHE_TTL_MS = 10 * 60 * 1000;
const responseCache = new Map();
const inFlightRequests = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildRequestKey(prompt, options) {
  return JSON.stringify({
    prompt,
    model: options.model ?? null,
    temperature: options.temperature ?? 0.8,
    maxTokens: options.maxTokens ?? 2048,
    systemInstruction: options.systemInstruction ?? null,
    jsonMode: !!options.jsonMode
  });
}

/**
 * Call the Gemini API with a prompt
 * @param {string} prompt - The text prompt to send
 * @param {Object} options - { model, temperature, maxTokens, systemInstruction }
 * @returns {Promise<string>} The generated text response
 */
export async function callGemini(prompt, options = {}) {
  const requestKey = buildRequestKey(prompt, options);
  const cached = responseCache.get(requestKey);
  if (cached && Date.now() - cached.createdAt < RESPONSE_CACHE_TTL_MS) {
    return cached.text;
  }
  if (inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey);
  }

  const apiKey = store.get('apiKey');
  if (!apiKey) {
    throw new Error('API key not set. Please enter your Gemini API key in settings.');
  }

  const task = (async () => {
    const {
      model = null,
      temperature = 0.8,
      maxTokens = 2048,
      systemInstruction = null
    } = options;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        topP: 0.95,
        topK: 40,
        responseMimeType: options.jsonMode ? "application/json" : "text/plain"
      }
    };

    // Add system instruction if provided
    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const modelsToTry = model ? [model] : MODEL_FALLBACKS;

    let lastError = null;
    for (const baseUrl of GEMINI_API_BASES) {
      for (const modelName of modelsToTry) {
        const url = `${baseUrl}/${modelName}:generateContent?key=${apiKey}`;

        try {
          let response = null;
          for (let attempt = 0; attempt <= MAX_429_RETRIES; attempt += 1) {
            response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestBody)
            });

            if (response.status !== 429) break;
            if (attempt === MAX_429_RETRIES) break;

            const retryAfter = Number(response.headers.get('Retry-After'));
            const retryDelay = Number.isFinite(retryAfter) && retryAfter > 0
              ? retryAfter * 1000
              : 1200 * (attempt + 1);
            await sleep(retryDelay);
          }

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData?.error?.message || `HTTP ${response.status}`;
            const isModelMissing =
              response.status === 404 &&
              (errorMessage.includes('is not found') || errorMessage.includes('not supported for generateContent'));

            if (response.status === 401 || response.status === 403) {
              throw new Error('Invalid API key. Please check your Gemini API key in settings.');
            }
            if (response.status === 429) {
              throw new Error('Rate limit exceeded. Too many requests or quota limit reached. Please wait and try again.');
            }
            if (isModelMissing) {
              lastError = new Error(`Gemini model unavailable: ${modelName}`);
              continue;
            }
            throw new Error(`Gemini API error: ${errorMessage}`);
          }

          const data = await response.json();

          // Extract text from response
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) {
            throw new Error('Empty response from Gemini API.');
          }

          const trimmed = text.trim();
          responseCache.set(requestKey, { text: trimmed, createdAt: Date.now() });
          return trimmed;
        } catch (error) {
          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your internet connection.');
          }
          throw error;
        }
      }
    }

    if (lastError) {
      throw new Error('No supported Gemini model is available for your API key/project. Please try again later or use a different Gemini model.');
    }

    throw new Error('Failed to call Gemini API.');
  })();

  inFlightRequests.set(requestKey, task);
  try {
    return await task;
  } finally {
    inFlightRequests.delete(requestKey);
  }
}

/**
 * Call Gemini and parse the response as JSON
 * @param {string} prompt - The prompt (should instruct JSON output)
 * @param {Object} options - Same as callGemini options
 * @returns {Promise<Object>} Parsed JSON response
 */
export async function callGeminiJSON(prompt, options = {}) {
  const text = await callGemini(prompt, {
    ...options,
    jsonMode: true,
    maxTokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.7 
  });

  // Clean up potential markdown code fences
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error('Failed to parse Gemini JSON response:', cleaned);
    throw new Error('AI response was not valid JSON. Please try again.');
  }
}

/**
 * Validate the API key by making a minimal request
 * @param {string} key - The API key to validate
 * @returns {Promise<boolean>} True if key is valid
 */
export async function validateApiKey(key) {
  for (const baseUrl of GEMINI_API_BASES) {
    for (const modelName of MODEL_FALLBACKS) {
      const url = `${baseUrl}/${modelName}:generateContent?key=${key}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello' }] }],
            generationConfig: { maxOutputTokens: 5 }
          })
        });
        if (response.ok) return true;
      } catch {
        // Continue trying other version/model combos.
      }
    }
  }
  return false;
}
