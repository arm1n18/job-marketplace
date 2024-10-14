import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Props {
    title : string;
    filters?: string[];
    minWidth?: string;
    className?: string;
    onReset: boolean;
    onSelect?: (selectedItem: string | null, title: string) => void;
}

export const Filter: React.FC<Props> = ({ title, filters, minWidth, className, onSelect, onReset }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [chosen, setChosen] = useState<string | null>(null);
    const openedRef = useRef<HTMLDivElement>(null);

    const handleItemClick = (selectedItem: any) => {
        if (selectedItem !== chosen) {
            if (onSelect) {
                onSelect(selectedItem, title);
            }
        }
      };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(isOpen && openedRef.current && !openedRef.current.contains(e.target as HTMLElement)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    useEffect(() => {
        if (onReset) {
            setChosen(null);
        }
    }, [onReset]);

    return (
        <div className={cn("relative", className)} ref={openedRef}>
            <div
                className={`${chosen ? `filters-block-selected` : `filters-block`} flex gap-2`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                { isOpen ? 
                    (<ChevronUp className="size-4 ml-1 mt-[4px]" />)
                    : (<ChevronDown className="size-4 ml-1 mt-[4px]" />)
                }
            </div>
            {isOpen && (
                <ul className="filters-list">
                    {filters!=null && filters.map((filter, index) => (
                        <li key={index} className={`filter-item flex justify-between items-center ${minWidth}`}
                            onClick={() => {setChosen(chosen === filter ? null : filter); setIsOpen(false); handleItemClick(filter)}}>
                            {filter}

                            {chosen === filter && (
                                    <Check className="size-4 ml-1 mt-[2px]" />
                                )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};