import { cn } from "@/lib/utils";
import { Filter } from "../ui/filter";
import { Slider } from "@/components/ui/slider";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, cities, employmentWithSubgroups, experience } from "../consts/filters-consts";
import { useFiltersStore } from "@/store/useFiltersStore";
import { FiltersType } from "@/types";

interface Props {
    onUpdateFilters: (filters: FiltersType) => void;
    setSelectedFormat?: (name: string | '') => void;
    className?: string;
}

export const FiltersSection: React.FC<Props> = ({ className, onUpdateFilters }) => {
    const [reset, setReset] = useState<boolean>(false);
    const [minValue, setMinValue] = useState([0]);
    const { filters, setFilters } = useFiltersStore();
    const params = new URLSearchParams();
    const searchParams = useSearchParams();

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
        
        const url = new URL(window.location.toString());
        url.searchParams.delete('search');
        window.history.pushState({}, '', url.toString());
        
        setMinValue([0]);
        setFilters(resetFilters);
        onUpdateFilters(resetFilters);
        
        setReset(true);
        setTimeout(() => {
            setReset(false);
        }, 100);
    }, [onUpdateFilters]);

    return (
        <div className={cn("justify-between max-md:hidden md:flex", className)}>
            <div className="flex items-center gap-1 md:gap-3">
                <Filter
                    title={"Категорія"}
                    defaultValue={searchParams.get('category')}
                    defaultSubValue={searchParams.get('subcategory')}
                    onReset={reset}
                    setSelectedGroup={(group, subgroup) => handleChange({ category: group, subcategory: subgroup })}
                    categories = {categories}
                    minWidth="min-w-48"
                />
                <Filter
                    defaultValue={yearsFormat}
                    onReset={reset}
                    setSelectedGroup={(group) => handleChange({ experience: group ? (group === 'Без досвіду' ? '0' : String(group).replace(/\D+/g, '')) : "" })}
                    title={"Досвід"}
                    categories = {experience}
                    minWidth="min-w-32"
                />
                <Filter
                    defaultValue={searchParams.get('city')}
                    onReset={reset}
                    setSelectedGroup={(group) => handleChange({ city: group })}
                    title={"Місто"}
                    categories = {cities}
                    minWidth="min-w-32"
                />
                <Filter
                    defaultValue={searchParams.get('employment')}
                    onReset={reset}
                    setSelectedGroup={(group) => handleChange({ employment: group })}
                    title={"Зайнятість"}
                    categories = {employmentWithSubgroups}
                    minWidth="min-w-40"
                />
                <div>
                <div className="h-[37px] flex flex-col justify-between">
                        <p className="filters-text">Зарплата від: ${Number(filters.salary_from) || Number(searchParams.get('salary_from')) || minValue[0]}</p>
                        <Slider
                            value={[Number(filters.salary_from) || Number(searchParams.get('salary_from')) || minValue[0]]}
                            max={10000}
                            step={500}
                            className={"max-w-40 min-w-40"}
                            onValueChange={(group) => {setMinValue(group), handleChange({salary_from: String(group)})}}
                        />
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                
                <Button className="w-fit" variant="outline" size="sm" onClick={() => {handleReset()}}>
                        <X className="w-4 h-4" />
                </Button>
                <Button className="w-fit" variant="default" size="sm" onClick={() => onUpdateFilters({ ...filters})}>
                        <Check  className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};