"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const JobSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String },
    sector: { type: String },
    description: { type: String },
    requirements: [{ type: String }],
    contactEmail: { type: String },
    contactPhone: { type: String },
    createdBy: { type: String, required: true },
}, { timestamps: true });
// Ajout des index
JobSchema.index({ location: 1 });
JobSchema.index({ sector: 1 });
JobSchema.index({ jobType: 1 });
exports.default = mongoose_1.default.model('Job', JobSchema);
//# sourceMappingURL=Job.js.map