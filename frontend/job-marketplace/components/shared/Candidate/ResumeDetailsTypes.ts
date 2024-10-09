import { KeywordsType } from "@/types/types";

export interface Resume {
  id?: number;
  creator_id?: number;
  title: string;
  work_experience: string;
  achievements?: string;
  category_name: string;
  subcategory_name?: string;
  salary: number;
  experience: number;
  employment_name: string;

  city_name?: string;
  keywords?: KeywordsType[];
}