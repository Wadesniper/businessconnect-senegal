"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formation = void 0;
const mongoose_1 = require("mongoose");
const moduleSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true },
    content: { type: String, required: true },
    order: { type: Number, required: true }
});
const formationSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    level: {
        type: String,
        enum: ['débutant', 'intermédiaire', 'avancé'],
        required: true
    },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    modules: [moduleSchema],
    thumbnail: { type: String },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    enrolledCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [{
            userId: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }],
    featured: { type: Boolean, default: false }
}, {
    timestamps: true
});
formationSchema.index({ title: 'text', description: 'text' });
formationSchema.index({ status: 1, category: 1 });
formationSchema.index({ instructor: 1 });
exports.Formation = (0, mongoose_1.model)('Formation', formationSchema);
//# sourceMappingURL=formation.js.map