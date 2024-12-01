'use client';

import { categories, cities, employment, experience } from "@/components/consts/filters-consts";
import { Button } from "@/components/ui/button";
import { CheckBoxesSection } from "@/components/ui/checkBoxesSection";
import { FilterMobile } from "@/components/ui/FilterMobile";
import { Slider } from "@/components/ui/slider";
import { useFiltersStore } from "@/store/useFiltersStore";
import { FiltersType } from "@/types";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Props {
    onUpdateFilters: (filters: FiltersType) => void;
    setSelectedFormat?: (name: string | '') => void;
    className?: string;
}


export const MobileFiltersSection: React.FC<Props> = ({ onUpdateFilters }) => {
    const [opened, setOpened] = useState(false);
    const [reset, setReset] = useState<boolean>(false);
    const [minValue, setMinValue] = useState([0]);
    const { filters, setFilters } = useFiltersStore();
    const searchParams = useSearchParams();
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if(opened) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }, [opened]);

    const experienceParam = searchParams.get('experience');
    const yearsFormat = experienceParam != null && experienceParam !== "" ?
        (Number(experienceParam) == 0 ? 'Без досвіду' : (experienceParam + (Number(experienceParam) > 4 ? " років" : (Number(experienceParam) > 1 ? " роки" : " рік"))))
        : null
        
    const handleChange = (fields: Partial<FiltersType>) => {
        setFilters(fields as FiltersType);
    };

    const handleReset = useCallback(() => {
        const resetFilters = {
            category: '',
            subcategory: '',
            experience: '',
            city: '',
            employment: '',
            salary_from: '',
        };
        
        setMinValue([0]);
        setFilters(resetFilters);
        onUpdateFilters(resetFilters);
        
        setReset(true);
        setTimeout(() => {
            setReset(false);
        }, 100);
    }, [onUpdateFilters]);

    return (
        <>
            <div className={`left-0 z-3000 bg-white w-full ${opened ? 'h-screen overflow-y-auto block top-0 fixed' : "h-24 py-6 bottom-0 sticky"} md:hidden`}>
                {!opened ? (
                    <Button 
                        variant={'outline'}
                        className="w-full h-full flex gap-2 filters-block mobile" 
                        onClick={() => setOpened(!opened)}>
                        Фільтри
                        <SlidersHorizontal size={20} />
                    </Button>
                ):
                <div>
                    <div className="flex justify-between font-semibold mt-4 items-center mb-8 mx-4 bg-white">
                        <h2 className="text-title-bg">Фільтри</h2>
                        <X size={24} className="text-common" onClick={() => setOpened(!opened)}/>
                    </div>
                    <div className="flex flex-col justify-between mb-6 px-4">
                        <div className="text-common-dark mb-4 flex gap-1">
                            <h1>Заробітна плата від: </h1>
                            <p className="text-salary"> ${Number(filters.salary_from) || Number(searchParams.get('salary_from')) || minValue[0]} </p> / на місяць
                        </div>
                        <Slider
                            value={[Number(filters.salary_from) || Number(searchParams.get('salary_from')) || minValue[0]]}
                            max={10000}
                            step={500}
                            onValueChange={(value) => {setMinValue(value), handleChange({salary_from: String(value[0])})}}
                        />
                    </div>
                    <div className="flex flex-col justify-between border-y border-[#D0D5DD]">
                        <FilterMobile
                            title={"Категорія"} 
                            categories={categories}
                            defaultValue={searchParams.get('category')}
                            defaultSubValue={searchParams.get('subcategory')} 
                            onReset={reset}
                            setSelectedGroup={(group, subgroup) => handleChange({ category: group, subcategory: subgroup })}/>
                    </div>
                    <div className="flex flex-col justify-between border-b border-[#D0D5DD]">
                        <FilterMobile
                            title={"Досвід"}
                            categories={experience}
                            defaultValue={yearsFormat}
                            onReset={reset}
                            setSelectedGroup={(value) => handleChange({ experience: value ? (value === 'Без досвіду' ? '0' : String(value).replace(/\D+/g, '')) : "" })}/>
                    </div>
                    <div className="flex flex-col justify-between border-b border-[#D0D5DD]">
                        <FilterMobile
                            title={"Місто"}
                            categories={cities}
                            defaultValue={searchParams.get('city')}
                            onReset={reset}
                            setSelectedGroup={(value) => handleChange({ city: value })}/>
                    </div>
                    <div className="flex flex-col justify-between mb-32 px-4 mt-4">
                        <legend className="text-common-dark mb-2">Зайнятість</legend>
                        <CheckBoxesSection title={employment}
                            defaultValue={searchParams.get('employment')}
                            setSelectedFormat={(value) => handleChange({ employment: value })}
                        />
                    </div>
                    <div className="fixed bottom-0 w-full bg-white pb-8 pt-6 border-t border-[#D0D5DD]">
                        <div className="flex gap-8 px-4 mb-2">
                            <div className="text-common-blue my-auto hover:cursor-pointer" onClick={handleReset}>Скинути</div>
                            <Button className="w-full" onClick={() => {onUpdateFilters({ ...filters}), setOpened(false)}}>
                                Застосувати
                            </Button>
                        </div>
                    </div>
                </div>
                }
            </div>

        </>
    )
}