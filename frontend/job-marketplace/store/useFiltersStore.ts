
import { FiltersType } from "@/types";
import { create } from "zustand";

type StoreType = {
    filters: FiltersType,
    setFilters: (newFilters: FiltersType) => void
}

export const useFiltersStore = create<StoreType>((set) => ({
    filters: {
        category: '',
        subcategory: '',
        experience: '',
        city: '',
        employment: '',
        salary_from: ''
    },
    setFilters: (newFilters) => set(( state ) => ({
        filters: { ...state.filters, ...newFilters },
    }))
}));