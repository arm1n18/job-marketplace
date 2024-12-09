import { KeywordsType } from "@/types/types";

export interface Job {
  id?: number;
  image_url?: string;
  category_name?: string;
  subcategory_name?: string;
  title?: string;
  city?: string;
  company_name?: string;
  experience?: number;
  salary_from?: number;
  salary_to?: number;
  keywords?: KeywordsType[];
  about_us?: string;
  description?: string;
  offer?: string;
  requirements?: string;
  employment_name?: string;
  city_name?: string;
  website?: string;
  created_at?: string;
  status?: any;
  inactive?: boolean;
  creator_id?: number;
  application_id?: number;
  offer_id?: number;
}

export interface JobCreate extends Job {
  email?: string;
}