import { cn } from "@/lib/utils";
import { FiltersTypeTwo } from "@/types/filters.type";
import { ChevronDown, ChevronUp } from "lucide-react";
import React,{ useState, useRef, useEffect } from "react";

interface Props {
    title: string;
    categories: FiltersTypeTwo[];
    onReset: boolean;
    defaultValue?: string | null;
    defaultSubValue?: string | null;
    setSelectedGroup?: (group: string | '', subgroup: string | '') => void;
    className ?: string;
}

export const FilterMobile: React.FC<Props> = ({className, title, categories, setSelectedGroup, onReset,defaultValue, defaultSubValue}) => {
    const chosenGroup = categories?.find((category) => 
        category.name === defaultValue && category.name!.length === defaultValue!.length
    )?.name ?? '';

    const chosenSubGroup = categories?.find((category) => category.subgroups?.includes(defaultSubValue!)) ? defaultSubValue ?? '' : '';

    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isOpenSubCategory, setIsOpenSubCategory] = useState<number | null>(null);
    const [selected, setSelected] = useState<{ group: string; subgroup: string }>({group: chosenGroup, subgroup: chosenSubGroup});
    const openedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chosenGroup = categories?.find((category) => 
            category.name === defaultValue && category.name!.length === defaultValue!.length
        )?.name ?? '';

        const chosenSubGroup = categories?.find((category) => category.subgroups?.includes(defaultSubValue!)) ? defaultSubValue ?? '' : '';
        
        setSelected({
            group: chosenGroup,
            subgroup: chosenSubGroup,
        });
    }, [defaultValue, categories]);


    const handleToggleSubCategory = (index: number) => {
    setIsOpenSubCategory(prevIndex => (
        prevIndex === index ? null : index
    ));
    };

    useEffect(() => {
        if (onReset) {
            setSelectedGroup?.('', '');
            setSelected({ group: '', subgroup: '' });
        }
    }, [onReset]);

    const handleGroupClick = (group: string, subgroup: string,) => {
        setSelectedGroup?.(group, subgroup);
        setSelected({ group, subgroup });
    };

    return (
        <div className={cn("relative", className)} ref={openedRef}>
            <div
                className={`${selected.group ? `filters-block-mobile selected` : `filters-block-mobile`} ${isOpen ? `filters-block-mobile selected` : ''} flex gap-2 items-center p-4`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <ChevronUp size={24} className={`mr-2 ${!isOpen ? 'rotate-180' : ''}`}/>
                
            </div>

            {isOpen && (
                <ul className={"filters-list-mobile px-4"}>
                {categories != null && Array.isArray(categories) && categories.map((category, index) => (
                    <React.Fragment key={index}>
                        <li key={index} className={`${selected.group != '' && selected.group && selected.subgroup !== '' && selected.group === category.name ? `filter-item-mobile selected` : `filter-item-mobile`} flex justify-between items-center`}
                        onClick={() => {
                            const newChosenGroup = selected.group === category.name && selected.subgroup === '' ? '' : category.name;
                            if (category.subgroups!.length === 0) {
                              setSelected({ group: newChosenGroup ?? '', subgroup: '' });
                            }
                          }}
                          >
                            <div className="flex gap-2">
                                    <input type="checkbox" className="size-5" checked={selected.group === category.name} onChange={() => {
                                        const newChosenGroup = selected.group === category.name && selected.subgroup == '' ? '' : category.name;
                                        setSelected({ group: newChosenGroup ?? '', subgroup: '' });
                                        handleGroupClick(newChosenGroup ?? '', '');
                                    }}/>
                                {category.name}
                                {category.subgroups!.length > 0 && <div className="key-word-block">{category.subgroups!.length}</div>}
                            </div>
                            {category.subgroups!.length > 0 && 
                                <ChevronDown size={24} color={"#1C64EE"} className={`mr-2 ${isOpenSubCategory == index ? 'rotate-180' : ''}`} onClick={(e) => { e.stopPropagation(); handleToggleSubCategory(index)}}/>
                            }
                        </li>
                        {category.subgroups!.length > 0 && isOpenSubCategory === index && (
                            category.subgroups!.map((subgroup, subgroupIndex) => (
                                <li className={`${selected.subgroup != '' && selected.subgroup === subgroup ? `filter-item-mobile selected` : `filter-item-mobile`} flex ml-6 gap-2 items-center mb-1`} key={subgroupIndex}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newChosenSubGroup = selected.subgroup === subgroup ? '' : subgroup  ;
                                        const newChosenGroup = selected.subgroup === subgroup ? '' : category.name  ;
                                        handleGroupClick(newChosenGroup ?? '', newChosenSubGroup);
                                    }}>
                                    <input type="checkbox" className="size-5" checked={selected.subgroup === subgroup} onChange={(e) => {
                                        e.stopPropagation();
                                        const newChosenSubGroup = selected.subgroup === subgroup ? '' : subgroup;
                                        handleGroupClick(category.name ?? '', newChosenSubGroup);
                                    }}/>

                                    {subgroup}
                                </li>
                            ))
                        )}
                    </React.Fragment>
                ))}
            </ul>
            
            )}
        </div>
    );
}