export const AUTH_CONFIG = {
  AUTO_LOGOUT: {
    CHECK_INTERVAL: 60 * 1000,
    BUFFER_TIME: 5 * 60 * 1000,
    ENABLE_TOKEN_REFRESH: true,
    LOGOUT_REDIRECT_PATH: '/login',
  },

  TOKEN_REFRESH: {
    MAX_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },

  SESSION: {
    TIMEOUT: 24 * 60 * 60 * 1000,
    WARNING_TIME: 10 * 60 * 1000,
  },
} as const;

export type AuthConfig = typeof AUTH_CONFIG;
