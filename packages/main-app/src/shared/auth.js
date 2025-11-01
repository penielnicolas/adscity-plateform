import { API_BASE_URL, AUTH_BASE_URL, COOKIES } from "./config";

export class AuthService {
    static async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    }

    static async logout() {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        // Redirection vers la page de login
        window.location.href = `${AUTH_BASE_URL}/signin`;
    }

    static async getCurrentUser() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                credentials: 'include'
            });

            if (response.ok) {
                return response.json();
            }
            return null;
        } catch (error) {
            console.error('Auth check failed:', error);
            return null;
        }
    }

    static isAuthenticated() {
        // Vérifie la présence du cookie (simplifié)
        return document.cookie.includes(COOKIES.USER_ID);
    }
}