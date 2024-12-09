import { KeywordsType } from "./types";


export interface Resume {
  company_id?: string;
  id?: number;
  jobID?: number;
  creator_id?: number;
  title?: string;
  jobTitle?: string;
  work_experience?: string;
  achievements?: string;
  category_name?: string;
  subcategory_name?: string;
  salary?: number;
  experience?: number;
  employment_name?: string;
  city_name?: string;
  keywords?: KeywordsType[];
  status?: any;
  offerID?: number;
  applicationID?: number;
}

export interface ResumeCreate extends Resume {
  email?: string;
}