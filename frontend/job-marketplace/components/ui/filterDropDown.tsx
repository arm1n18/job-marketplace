import { cn } from "@/lib/utils";
import { FiltersTypeTwo } from "@/types/types";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import React,{ useState, useRef, useEffect } from "react";
import { set } from "zod";

interface Props {
    title: string;
    categories: FiltersTypeTwo[];
    setSelectedGroup: (group: string | '', subgroup: string | '') => void;
    className ?: string;
}

export const FilterDropDown: React.FC<Props> = ({className, title, categories, setSelectedGroup}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<{ group: string; subgroup: string }>({ group: '', subgroup: '' });
    const openedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(isOpen && openedRef.current && !openedRef.current.contains(e.target as HTMLElement)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    const handleGroupClick = (group: string, subgroup: string) => {
        setSelectedGroup(group, subgroup);
        setSelected({ group, subgroup });
    };

    return (
        <div className={cn("relative", className)} ref={openedRef}>
            <div
                className={`${selected.group ? `filters-block-selected-two` : `filters-block-two`} flex gap-2`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected.group ? selected.group + (selected.subgroup ? ` -> ${selected.subgroup}` : '') : title}
                { isOpen ? 
                    (<ChevronUp className="size-4 ml-1 mt-1" />)
                    : (<ChevronDown className="size-4 ml-1 mt-1" />)
                }
            </div>
            {isOpen && (
                <ul className={cn("filters-list-two", className)}>
                {categories != null && Array.isArray(categories) && categories.map((category, index) => (
                    <React.Fragment key={index}>
                        <li className={`filter-item flex justify-between items-center`}
                            onClick={() => {
                                const newChosenGroup = selected.group === category.name ? '' : category.name  
                                setSelected({ group: newChosenGroup ?? '', subgroup: '' });
                                handleGroupClick(newChosenGroup ?? '', '');
                                setIsOpen(false);
                            }}
                        >
                            {category.name}
                            {selected.group === category.name && (
                                <Check className="size-4 ml-1 mt-[2px]" />
                            )}
                        </li>
                        {category.subgroups!.length > 0 &&  (
                            category.subgroups!.map((subgroup, subgroupIndex) => (
                                <li key={subgroupIndex} className={`filter-item flex justify-between items-center ml-4`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newChosenSubGroup = selected.subgroup === subgroup ? '' : subgroup  ;
                                        handleGroupClick(category.name ?? '', newChosenSubGroup);
                                        setIsOpen(false);
                                    }}>
                                    {subgroup}
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