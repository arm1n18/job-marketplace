export interface KeywordsType {
    id: number;
    name: string;
}

export interface ParameterType  {
    id: number;
    name: string;
    description: string;
}


export interface FiltersType {
    name?: string;
    // subgroups?: string;
    category?: string;
    subcategory: string | '';
    experience?: string;
    city?: string;
    employment?: string;
    salary_from?: string;
}

export interface FiltersTypeTwo {
    name?: string;
    subgroups?: string[];
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