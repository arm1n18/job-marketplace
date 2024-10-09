import { KeywordsType } from "@/types/types";

export interface Job {
    id?: number;
    experience: number;
    image_url?: string;
    category_name: string;
    title: string;
    city?: string;
    company_name: string;
    salary_from?: number;
    salary_to?: number;
    keywords?: KeywordsType[];
    about_us?: string;
    description?: string;
    offer?: string;
    requirements?: string;
    employment_name: string;
    subcategory_name: string;
    city_name: string;
    website?: string;
  }