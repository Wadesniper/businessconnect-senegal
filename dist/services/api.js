"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const axios_1 = __importDefault(require("axios"));
exports.api = axios_1.default.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});
exports.api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
exports.api.interceptors.response.use(response => response, error => {
    var _a;
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/login';
    }
    return Promise.reject(error);
});
//# sourceMappingURL=api.js.map