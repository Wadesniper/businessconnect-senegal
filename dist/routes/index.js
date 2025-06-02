"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const jobs_1 = __importDefault(require("./jobs"));
const subscriptions_1 = __importDefault(require("./subscriptions"));
exports.routes = {
    auth: auth_1.default,
    users: user_1.default,
    jobs: jobs_1.default,
    subscriptions: subscriptions_1.default
};
//# sourceMappingURL=index.js.map