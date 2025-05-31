"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceItem = void 0;
const mongoose_1 = require("mongoose");
const marketplaceItemSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    seller: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    images: [{ type: String }],
    reports: { type: Number, default: 0 },
}, { timestamps: true });
exports.MarketplaceItem = (0, mongoose_1.model)('MarketplaceItem', marketplaceItemSchema);
