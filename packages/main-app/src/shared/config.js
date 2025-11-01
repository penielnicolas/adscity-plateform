// Configuration commune
export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const AUTH_BASE_URL = process.env.REACT_APP_AUTH_URL;
export const COOKIE_DOMAIN = process.env.NODE_ENV === 'production' ? '.adscity.net' : 'localhost';

// Cookies names
export const COOKIES = {
    SESSION_ID: 'adscity.sid',
    USER_ID: 'adscity.id',
    AUTH_TOKEN: 'adscity.token'
};

export const ROUTES = {
    LOGIN: '/signin',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile'
};