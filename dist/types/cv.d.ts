export interface Experience {
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string[];
    achievements?: string[];
}
export interface Education {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string[];
}
export interface Skill {
    name: string;
    level: number;
    category?: string;
}
export interface Language {
    name: string;
    level: string;
}
export interface CV {
    template: 'modern' | 'classic' | 'creative' | 'professional';
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address?: string;
        title?: string;
        summary?: string;
        website?: string;
        linkedin?: string;
        github?: string;
    };
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
    certifications?: string[];
    interests?: string[];
    references?: string[];
}
