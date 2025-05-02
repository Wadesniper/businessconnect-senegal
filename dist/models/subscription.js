"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'cancelled'],
        default: 'pending'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    cancelledAt: {
        type: Date
    },
    renewedAt: {
        type: Date
    },
    paymentId: {
        type: String
    }
}, {
    timestamps: true
});
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ paymentId: 1 });
exports.Subscription = (0, mongoose_1.model)('Subscription', subscriptionSchema);
//# sourceMappingURL=subscription.js.map