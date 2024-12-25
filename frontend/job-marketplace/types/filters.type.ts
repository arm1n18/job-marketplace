export interface FiltersType {
    page?: string | '';
    category?: string;
    subcategory: string | '';
    experience?: string;
    city?: string;
    employment?: string;
    salary_from?: string;
    offer?: string;
    application?: string;
}

export interface FiltersTypeTwo {
    name?: string;
    subgroups?: string[];
}