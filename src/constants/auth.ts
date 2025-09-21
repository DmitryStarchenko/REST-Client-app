export const AUTH_CONFIG = {
  // Auto-logout settings
  AUTO_LOGOUT: {
    // Check token expiration every minute
    CHECK_INTERVAL: 60 * 1000, // 1 minute

    // Buffer time before token expires to trigger refresh/logout
    BUFFER_TIME: 5 * 60 * 1000, // 5 minutes

    // Enable automatic token refresh
    ENABLE_TOKEN_REFRESH: true,

    // Redirect path after logout
    LOGOUT_REDIRECT_PATH: '/login',
  },

  // Token refresh settings
  TOKEN_REFRESH: {
    // Maximum number of refresh attempts
    MAX_ATTEMPTS: 3,

    // Delay between refresh attempts (in milliseconds)
    RETRY_DELAY: 1000,
  },

  // Session settings
  SESSION: {
    // Default session timeout (in milliseconds)
    TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours

    // Warning time before session expires (in milliseconds)
    WARNING_TIME: 10 * 60 * 1000, // 10 minutes
  },
} as const;

export type AuthConfig = typeof AUTH_CONFIG;
