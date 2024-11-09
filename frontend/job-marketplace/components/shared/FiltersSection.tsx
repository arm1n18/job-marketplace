import { cn } from "@/lib/utils";
import { Filter } from "../ui/filter";
import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { FiltersType } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { categories, cities, experience } from "../consts/filters-consts";

interface Props {
    onUpdateFilters: (filters: FiltersType) => void;
    setSelectedFormat?: (name: string | '') => void;
    className?: string;
}

export const FiltersSection: React.FC<Props> = ({ className, onUpdateFilters }) => {
    const [reset, setReset] = useState<boolean>(false);
    const [minValue, setMinValue] = useState([0]);
    const [filters, setFilters] = useState<FiltersType>({ category: '', subcategory: '', experience: '', city: '', employment: '', salary_from: ''});
    const searchParams = useSearchParams();

    const experienceParam = searchParams.get('experience');
    const yearsFormat = experienceParam != null && experienceParam !== "" ?
        (Number(experienceParam) == 0 ? 'Без досвіду' : (experienceParam + (Number(experienceParam) > 4 ? " років" : (Number(experienceParam) > 1 ? " роки" : " рік"))))
        : null
        
    useEffect(() => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            category: searchParams.get('category') ?? '',
            subcategory: searchParams.get('subcategory') ?? '',
            experience: searchParams.get('experience') ?? '',
            city: searchParams.get('city') ?? '',
            employment: searchParams.get('employment') ?? '',
            salary_from: searchParams.get('salary_from') ?? ''
        }));
    }, [searchParams]);
        

    // const handleSelect = useCallback((item: string | null, title: string) => {
    //     setFilters((prevFilters) => {
    //         const updatedFilters = { ...prevFilters };
    
    //         switch (title) {
    //             case 'Категорії':
    //                 updatedFilters.category = item ? item;
    //                 break;
    //             case 'Досвід':
    //                 updatedFilters.experience = item ? (item === 'Без досвіду' ? ['0'] : [item.replace(/\D+/g, '')]) : [];
    //                 break;
    //             case 'Місто':
    //                 updatedFilters.city = item ? [item] : [];
    //                 break;
    //             case 'Зайнятість':
    //                 updatedFilters.employment = item ? [item] : [];
    //                 break;
    //             default:
    //                 console.log(filters);
    //                 break;
    //         }
    
    //         return updatedFilters;
    //     });
    // }, [filters]);
    
    // useEffect(() => {
    //     onUpdateFilters(filters);
    // }, [filters])

    const updateFilter = (filterName: string, value: string) => {
        setFilters((prevFilters) => {
           const updatedFilters = {
            ...prevFilters,
            [filterName]: value, 
        };
        onUpdateFilters(updatedFilters);
        return updatedFilters
        }) ;
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

    const handleSalarySubmit = (value: number) => {
        setFilters({ ...filters, "salary_from": value.toString()});
    };

    const handleGroupClick = (group: string, subgroup: string) => {
        setFilters({ ...filters, "category": group, "subcategory": subgroup});
    };

    const handleExperience = (experience: string) => {
        setFilters({ ...filters, "experience": experience ? (experience === 'Без досвіду' ? '0' : experience.replace(/\D+/g, '')) : ''});
    };

    const handleCityClick = (city: string) => {
        setFilters({ ...filters, "city": city});
    };

    const handleEmploymentClick = (employment: string) => {
        setFilters({ ...filters, "employment": employment});
    };

    const handleApplyFilters = () => {
        // onUpdateFilters({ ...filters, salary_from: minValue[0] === 0 ? null : [minValue[0].toString()]});
        onUpdateFilters({ ...filters});
    };
    

    return (
        <div className={cn("flex justify-between", className)}>
            <div className="flex items-center gap-6">
                <Filter
                    defaultValue={searchParams.get('category')}
                    onReset={reset}
                    setSelectedGroup={handleGroupClick}
                    title={"Категорії"}
                    categories = {categories}
                    minWidth="min-w-48"
                />
                <Filter
                    defaultValue={yearsFormat}
                    onReset={reset}
                    setSelectedGroup={handleExperience}
                    title={"Досвід"}
                    categories = {experience}
                    minWidth="min-w-32"
                />
                <Filter
                    defaultValue={searchParams.get('city')}
                    onReset={reset}
                    setSelectedGroup={handleCityClick}
                    title={"Місто"}
                    categories = {cities}
                    minWidth="min-w-32"
                />
                <Filter
                    defaultValue={searchParams.get('employment')}
                    onReset={reset}
                    setSelectedGroup={handleEmploymentClick}
                    title={"Зайнятість"}
                    categories = {[
                        {name: 'Віддалена робота', subgroups: []},
                        {name: 'Part-time', subgroups: []},
                        {name: 'Офіс', subgroups: []},
                    ]}
                    minWidth="min-w-40"
                />
                <div>
                <div className="h-[37px] flex flex-col justify-between">
                        <p className="filters-text">Зарплата від: ${Number(filters.salary_from) || minValue[0]}</p>
                        <Slider
                            value={[Number(filters.salary_from) || minValue[0]]}
                            max={10000}
                            step={500}
                            className={"max-w-40 min-w-40"}
                            onValueChange={(minValue) => {setMinValue(minValue), handleSalarySubmit(minValue[0])}}
                        />
                    </div>
                </div>
            </div>
            <div className="flex gap-3">
                <Button className="w-fit" variant="outline" onClick={handleReset}>
                        <X className="w-4 h-4" />
                </Button>
                <Button className="w-fit" variant="default" onClick={handleApplyFilters}>
                        <Check  className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
