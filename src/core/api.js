/**
 * The Gift Brief — AI API Layer (Groq)
 * Handles all communication with the Groq API
 */

import store from './store.js';

const GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_FALLBACKS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768'
];
const REQUEST_TIMEOUT_MS = 25000; // Total timeout per request
const RESPONSE_CACHE_TTL_MS = 10 * 60 * 1000;
const responseCache = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Call the Groq API with a prompt
 */
export async function callAI(prompt, options = {}) {
  const apiKey = store.get('apiKey');
  if (!apiKey) {
    throw new Error('API key not set. Please enter your Groq API key in settings.');
  }

  const {
    model = null,
    temperature = 0.8,
    maxTokens = 2048,
    systemInstruction = null
  } = options;

  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const modelsToTry = model ? [model] : MODEL_FALLBACKS;
  let lastError = null;

  for (const modelName of modelsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(GROQ_API_BASE, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelName,
          messages,
          temperature,
          max_tokens: maxTokens,
          top_p: 1,
          stream: false
          // We removed response_format: "json_object" for maximum compatibility across all Groq models
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `HTTP ${response.status}`;
        
        if (response.status === 401 || response.status === 403) {
          throw new Error('Invalid API key. Please check your Groq API key in settings.');
        }
        
        lastError = new Error(`Groq [${modelName}] error: ${errorMessage}`);
        continue; // Try next model
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;
      
      if (!text) {
        lastError = new Error(`Empty response from model ${modelName}`);
        continue;
      }

      return text.trim();

    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        lastError = new Error(`Groq request timed out on ${modelName}`);
      } else {
        lastError = error;
      }
      // Try next model immediately on any failure
      console.warn(`Groq model ${modelName} failed, trying fallback...`, error);
      await sleep(200); 
    }
  }

  throw lastError || new Error('All Groq models failed to respond.');
}

// Backward compatibility
export const callGemini = callAI;

/**
 * Call Groq and parse the response as JSON
 */
export async function callAIJSON(prompt, options = {}) {
  const text = await callAI(prompt, {
    ...options,
    maxTokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.7 
  });

  // Extract JSON from potential markdown fences
  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error('Failed to parse Groq response as JSON:', text);
    throw new Error('AI response was not valid JSON. Please try again.');
  }
}

// Backward compatibility
export const callGeminiJSON = callAIJSON;

/**
 * Minimal check for API key
 */
export async function validateApiKey(key) {
  try {
    const response = await fetch(GROQ_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}
