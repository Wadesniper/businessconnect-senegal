"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CV = void 0;
const mongoose_1 = require("mongoose");
const cvSchema = new mongoose_1.Schema({
    template: {
        type: String,
        enum: ['modern', 'classic', 'creative', 'professional'],
        required: true
    },
    personalInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: String,
        title: String,
        summary: String,
        website: String,
        linkedin: String,
        github: String
    },
    experience: [{
            company: { type: String, required: true },
            position: { type: String, required: true },
            location: { type: String, required: true },
            startDate: { type: String, required: true },
            endDate: String,
            current: Boolean,
            description: [String],
            achievements: [String]
        }],
    education: [{
            school: { type: String, required: true },
            degree: { type: String, required: true },
            field: { type: String, required: true },
            startDate: { type: String, required: true },
            endDate: String,
            current: Boolean,
            description: [String]
        }],
    skills: [{
            name: { type: String, required: true },
            level: { type: Number, required: true },
            category: String
        }],
    languages: [{
            name: { type: String, required: true },
            level: { type: String, required: true }
        }],
    certifications: [String],
    interests: [String],
    references: [String]
});
exports.CV = (0, mongoose_1.model)('CV', cvSchema);
//# sourceMappingURL=cv.js.map