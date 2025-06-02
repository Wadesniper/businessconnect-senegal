"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formation = void 0;
const mongoose_1 = require("mongoose");
const moduleSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    content: { type: String, required: true }
});
const formationSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    level: { type: String, enum: ['débutant', 'intermédiaire', 'avancé'], required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    modules: [moduleSchema],
    enrollments: { type: Number, default: 0 },
    cursaUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
formationSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
// Indexes pour améliorer les performances
formationSchema.index({ title: 'text', description: 'text' });
formationSchema.index({ status: 1, category: 1 });
formationSchema.index({ instructor: 1 });
exports.Formation = (0, mongoose_1.model)('Formation', formationSchema);
//# sourceMappingURL=formation.js.map