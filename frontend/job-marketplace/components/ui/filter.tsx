import { cn } from "@/lib/utils";
import { FiltersTypeTwo } from "@/types/types";
import { on } from "events";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Props {
    title : string;
    categories: FiltersTypeTwo[];
    minWidth?: string;
    className?: string;
    onReset: boolean;
    defaultValue?: string | null
    onSelect?: (selectedItem: string | null, title: string) => void;
    setSelectedGroup: (group: string | '', subgroup: string | '') => void;
}

export const Filter: React.FC<Props> = ({ title, categories, minWidth, className, setSelectedGroup, onReset, defaultValue }) => {
    const chosenFilter = categories?.find((category) => 
        category.name === defaultValue && category.name!.length === defaultValue!.length
    );
    const chosenGroup = chosenFilter?.name ?? 
    categories?.find((category) => category.name?.includes(defaultValue!))?.name ?? '';

    const chosenSubGroup = categories?.find((category) => category.subgroups?.includes(defaultValue!)) ? defaultValue ?? '' : '';

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<{ group: string; subgroup: string }>({ group: chosenGroup, subgroup: chosenSubGroup });
    const [subMenu, setSubMenu] = useState<string | null>(null);
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

    useEffect(() => {
        if (onReset) {
            setSelectedGroup('', '');
            setSelected({ group: '', subgroup: '' });
        }
    }, [onReset]);

    return (
        <div className={cn("relative", className)} ref={openedRef}>
            <div
                className={`${selected.group ? `filters-block-selected` : `filters-block`} flex gap-2`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                { isOpen ? 
                    (<ChevronUp className="size-4 ml-1 mt-1" />)
                    : (<ChevronDown className="size-4 ml-1 mt-1" />)
                }
            </div>
            {isOpen && (
                <ul className="filters-list">
                    {categories!=null && Array.isArray(categories) && categories.map((category, index) => (
                        <li key={index} className={`${selected.group != '' && selected.group === category.name ? `filter-item-selected` : `filter-item`} flex justify-between items-center ${minWidth}`}
                            onClick={() => {
                                const newChosenGroup = selected.group === category.name ? '' : category.name  
                                if(newChosenGroup === '') {
                                    setSelectedGroup('', '');
                                }
                                setSelectedGroup(newChosenGroup ?? '', '');
                                setIsOpen(false);
                                handleGroupClick(newChosenGroup ?? '', '');
                                
                            }}
                            onMouseEnter={() => setSubMenu(category.name ?? null)}>

                            {category.name}
                            {selected.group === category.name && !onReset &&(
                                    <Check className="size-4 ml-1 mt-[2px]" />
                            )}

                            {subMenu == category.name && category.subgroups && category.subgroups.length > 0 && (
                                <ul className="subfilters-list">
                                    {category.subgroups.map((subFilter: string, index: number) => (
                                        <li className={`${selected.subgroup != '' && selected.subgroup === subFilter ? `filter-item-selected` : `filter-item`} flex justify-between items-center`} key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newChosenSubGroup = selected.subgroup === subFilter ? '' : subFilter  ;
                                                console.log("sub clicked:", selected.subgroup);
                                                handleGroupClick(category.name ?? '', newChosenSubGroup);
                                            }}>
                                            {subFilter}
                                            {selected.subgroup === subFilter && (
                                                <Check className="size-4 mt-[2px]" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};