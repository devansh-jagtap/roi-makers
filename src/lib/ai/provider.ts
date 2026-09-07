import { createGoogleGenerativeAI } from '@ai-sdk/google';

/**
 * Single place where the model provider is configured.
 *
 * Routes import the named model handles below instead of writing model id
 * strings inline, so swapping a model is a one-line change here rather than a
 * hunt through the API routes.
 */

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

const google = createGoogleGenerativeAI({
  // Empty string keeps the factory from throwing at import time on a machine
  // without the key. `isAiConfigured()` is what the routes actually check.
  apiKey: apiKey ?? '',
});

/** Drives both assistants: fast enough to stream, good enough to use tools. */
export const chatModel = google('gemini-3.6-flash');

/** Cheap model used only to condense old turns into a rolling summary. */
export const summaryModel = google('gemini-3.5-flash-lite');

/**
 * True when the Gemini key is present. Routes call this first so a missing key
 * produces a clean 503 instead of a provider stack trace mid-stream.
 */
export function isAiConfigured(): boolean {
  return Boolean(apiKey && apiKey.trim());
}

/** Caps applied to every call so a runaway generation cannot burn the budget. */
export const generationLimits = {
  maxOutputTokens: 1200,
  temperature: 0.4,
} as const;
