import { cn } from "@/lib/utils";
import { FiltersTypeTwo } from "@/types/filters.type";
import { Check, ChevronUp } from "lucide-react";
import React,{ useState, useRef, useEffect } from "react";

interface Props {
    title: string;
    categories: FiltersTypeTwo[];
    defaultValue?: string | null;
    defaultSubValue?: string | null;
    setSelectedGroup?: (group: string | '', subgroup: string | '') => void;
    disabled?: boolean
    className ?: string;
}

export const FilterDropDown: React.FC<Props> = ({className, title, categories, setSelectedGroup, defaultValue, defaultSubValue, disabled}) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<{ group: string; subgroup: string }>({group: '', subgroup: ''});
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


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(isOpen && openedRef.current && !openedRef.current.contains(e.target as HTMLElement)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    const handleGroupClick = (group: string, subgroup: string,) => {
        setSelectedGroup?.(group, subgroup);
        setSelected({ group, subgroup });
    };

    return (
        <div className={cn("relative", className)} ref={openedRef}>
            <div
                className={`${selected.group ? `filters-block-selected-two` : `filters-block-two`} ${isOpen ? `filters-block-selected-two` : ''} flex gap-2 ${disabled && 'cursor-not-allowed opacity-50'}`}
                onClick={() => {!disabled && setIsOpen(!isOpen)}}
            >
                {selected.group ? (selected.subgroup ? selected.group + (selected.subgroup ? ` → ${selected.subgroup}` : '') : selected.group) : title}

                <ChevronUp size={24} className={`size-4 ml-1 mt-1 ${!isOpen ? 'rotate-180' : ''}`}/>
            </div>
            {isOpen && (
                <ul className={cn("filters-list top-12 two", className)}>
                {categories != null && Array.isArray(categories) && categories.map((category, index) => (
                    <React.Fragment key={index}>
                        <li key={index} className={`${selected.group != '' && selected.group && selected.subgroup == '' && selected.group === category.name ? `filter-item-selected` : `filter-item`} flex justify-between items-center mb-1`}
                            onClick={() => {
                                const newChosenGroup = selected.group === category.name && selected.subgroup == '' ? '' : category.name;  
                                setSelected({ group: newChosenGroup ?? '', subgroup: '' });
                                handleGroupClick(newChosenGroup ?? '', '');
                                setIsOpen(false);
                            }}
                        >
                            {category.name}
                            {selected.group === category.name && selected.subgroup == '' && (
                                <Check className="size-4 ml-1 mt-[2px]" />
                            )}
                        </li>
                        {category.subgroups!.length > 0 &&  (
                            category.subgroups!.map((subgroup, subgroupIndex) => (
                                <li className={`${selected.subgroup != '' && selected.subgroup === subgroup ? `filter-item-selected` : `filter-item`} flex justify-between items-center mb-1`} key={subgroupIndex}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newChosenSubGroup = selected.subgroup === subgroup ? '' : subgroup  ;
                                        const newChosenGroup = selected.subgroup === subgroup ? '' : category.name  ;
                                        handleGroupClick(newChosenGroup ?? '', newChosenSubGroup);
                                        setIsOpen(false);
                                    }}>
                                    {category.name + " → "}{subgroup}
                                    {selected.subgroup === subgroup && (
                                        <Check className="size-4 ml-1 mt-[2px]" />
                                    )}
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