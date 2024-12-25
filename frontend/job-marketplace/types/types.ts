export interface KeywordsType {
    name: string;
}

export interface ParameterType  {
    id: number;
    name: string;
    description: string;
}

export interface SendJobType {
    title?: string;
    description?: string;
    salary_from?: string;
    salary_to?: string;
    employment?: string;
    category?: string;
}

export type Roles = "CANDIDATE" | "RECRUITER"