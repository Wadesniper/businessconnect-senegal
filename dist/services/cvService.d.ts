interface PDFGenerationResult {
    buffer: Buffer;
    filename: string;
}
export declare class CVService {
    private readonly UPLOAD_DIR;
    constructor();
    generatePDF(cvData: any): Promise<PDFGenerationResult>;
    generateCV(cvData: any): Promise<string>;
    private applyTemplate;
    private applyModernTemplate;
    private applyClassicTemplate;
    private applyCreativeTemplate;
    private applyProfessionalTemplate;
    private addExperienceSection;
    private addEducationSection;
    private addSkillsSection;
    private addLanguagesSection;
    static createCV(userId: string, cvData: any): Promise<import("mongoose").Document<unknown, {}, import("../types/cv").CV, {}> & import("../types/cv").CV & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    static getCVsByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../types/cv").CV, {}> & import("../types/cv").CV & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    static getCVById(cvId: string): Promise<import("mongoose").Document<unknown, {}, import("../types/cv").CV, {}> & import("../types/cv").CV & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    static updateCV(cvId: string, userId: string, cvData: any): Promise<import("mongoose").Document<unknown, {}, import("../types/cv").CV, {}> & import("../types/cv").CV & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    static deleteCV(cvId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../types/cv").CV, {}> & import("../types/cv").CV & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
export {};
