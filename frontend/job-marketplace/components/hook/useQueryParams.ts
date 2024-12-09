import { FiltersType } from "@/types";
import { useMemo } from "react"

export const useQueryParams = (searchFilter: string | null, filters?: FiltersType) => {
    return useMemo(() => {
        const params = new URLSearchParams();
        if(searchFilter) params.append('search', searchFilter);
        if(filters) {
            if(filters.category) params.append('category', filters.category);
            if(filters.subcategory) params.append('subcategory', filters.subcategory);
            if(filters.experience) params.append('experience', filters.experience);
            if(filters.city) params.append('city', filters.city);
            if(filters.employment) params.append('employment', filters.employment);
            if(filters.salary_from) params.append('salary_from', filters.salary_from);
        }

        return params;
    }, [searchFilter, filters]);
}