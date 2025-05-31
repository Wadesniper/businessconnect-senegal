"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certification = exports.Language = exports.Skill = exports.Experience = exports.Education = exports.CV = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const educationSchema = new mongoose_1.default.Schema({
    school: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    field: String,
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    description: String,
    location: String
});
const experienceSchema = new mongoose_1.default.Schema({
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    current: {
        type: Boolean,
        default: false
    },
    description: String,
    location: String,
    achievements: [String]
});
const skillSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['débutant', 'intermédiaire', 'avancé', 'expert'],
        required: true
    },
    category: {
        type: String,
        enum: ['technique', 'soft', 'langue'],
        required: true
    }
});
const languageSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'natif'],
        required: true
    }
});
const certificationSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    issuer: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String
});
const cvSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    template: {
        type: String,
        required: true,
        enum: ['modern', 'classic', 'creative', 'professional']
    },
    personalInfo: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: String,
        address: String,
        city: String,
        country: String,
        title: String,
        summary: String,
        photo: String,
        linkedin: String,
        github: String,
        website: String
    },
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [skillSchema],
    languages: [languageSchema],
    certifications: [certificationSchema],
    projects: [{
            name: {
                type: String,
                required: true
            },
            description: String,
            technologies: [String],
            url: String,
            startDate: Date,
            endDate: Date
        }],
    customSections: [{
            title: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            }
        }],
    isPublic: {
        type: Boolean,
        default: false
    },
    lastGenerated: Date,
    pdfUrl: String,
    color: {
        type: String,
        default: '#2196f3'
    },
    font: {
        type: String,
        default: 'Roboto'
    }
}, {
    timestamps: true
});
// Indexes
cvSchema.index({ userId: 1 });
cvSchema.index({ 'personalInfo.firstName': 'text', 'personalInfo.lastName': 'text', 'personalInfo.title': 'text' });
cvSchema.index({ isPublic: 1 });
// Hooks
cvSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.lastGenerated = undefined;
        this.pdfUrl = undefined;
    }
    next();
});
exports.CV = mongoose_1.default.model('CV', cvSchema);
exports.Education = mongoose_1.default.model('Education', educationSchema);
exports.Experience = mongoose_1.default.model('Experience', experienceSchema);
exports.Skill = mongoose_1.default.model('Skill', skillSchema);
exports.Language = mongoose_1.default.model('Language', languageSchema);
exports.Certification = mongoose_1.default.model('Certification', certificationSchema);
