import { create } from "zustand";

type StoreType = {
    applied: boolean,
    setApplied: (newApply: boolean) => void
}

export const useApplyStore = create<StoreType>((set) => ({
    applied: false,
    setApplied: (newApply) => set(( state ) => ({
        applied: newApply
    }))
}));