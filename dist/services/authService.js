"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const api_1 = require("./api");
const TOKEN_KEY = 'auth_token';
exports.authService = {
    async login(credentials) {
        const response = await api_1.api.post('/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem(TOKEN_KEY, response.data.data.token);
        }
        return response.data;
    },
    async register(data) {
        const response = await api_1.api.post('/auth/register', data);
        if (response.data.success) {
            localStorage.setItem(TOKEN_KEY, response.data.data.token);
        }
        return response.data;
    },
    async getCurrentUser() {
        const response = await api_1.api.get('/auth/me');
        return response.data;
    },
    async updateProfile(data) {
        const response = await api_1.api.put('/auth/profile', data);
        return response.data;
    },
    async logout() {
        localStorage.removeItem(TOKEN_KEY);
    },
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },
    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },
    isAuthenticated() {
        return !!this.getToken();
    }
};
//# sourceMappingURL=authService.js.map