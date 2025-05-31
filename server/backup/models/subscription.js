"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    plan: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'active', 'expired', 'cancelled'],
        default: 'pending'
    },
    paymentId: { type: String },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true }
}, {
    timestamps: true
});
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ paymentId: 1 });
exports.Subscription = (0, mongoose_1.model)('Subscription', subscriptionSchema);
