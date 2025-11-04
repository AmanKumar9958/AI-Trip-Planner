// Lightweight logger with environment-aware levels
// - info/warn only log in development
// - error always logs (useful in production)
const isDev = import.meta?.env?.DEV;

export const logger = {
  info: (...args) => { if (isDev) console.info('[AI-Trip-Planner]', ...args); },
  warn: (...args) => { if (isDev) console.warn('[AI-Trip-Planner]', ...args); },
  error: (...args) => { console.error('[AI-Trip-Planner]', ...args); },
};

export default logger;
