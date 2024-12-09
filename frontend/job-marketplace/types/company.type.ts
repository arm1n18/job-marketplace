export interface Company {
    id?: number;
    recruiter_id?: number;
    company_name: string;
    about_us: string;
    image_url: string;
    website: string;
    linkedin: string;
    facebook: string;
}

export interface CompaniesList extends Company {
    total_jobs?: number;
    average_salary?: number
}