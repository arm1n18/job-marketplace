import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOpenedRef } from "../hook/useOpenedRef";

interface Props {
    onSearch: (query: string) => void;
    value?: string;
    className?: string;
}


export const SearchInput: React.FC<Props> = ({ className, onSearch, value }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMenu, setSearchMenu] = useState(false);
    const [storedQueries, setStoredQueries] = useState<string[]>([]);

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const storedQueries = localStorage.getItem('searchQueries');
            const parsedQueries = storedQueries ? JSON.parse(storedQueries) : [];
            setStoredQueries(parsedQueries);
        }
    }, [])

    const openedRef = useRef<HTMLDivElement>(null);
    useOpenedRef({isOpen: searchMenu, setIsOpen: setSearchMenu, openedRef});

    useEffect(() => {
        setSearchQuery(value || "");
    }, [value]);

    const handleSearch = async(searchQuery: string) => {
        try {
            onSearch(searchQuery);
        } catch(err) {
            console.error("Error fetching search results:", err);
        }
    }
    
    const onEnterClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            handleSearch(searchQuery);
            setSearchMenu(false);
            addToHistory(searchQuery);
        }
    }

    function addToHistory(dataToSave: string) {
        if(!storedQueries.includes(dataToSave)){
            if(storedQueries.length >= 5) {
                storedQueries.pop();
            }
            storedQueries.unshift(dataToSave);
        };
        localStorage.setItem('searchQueries', JSON.stringify(storedQueries));
    }
    
    // function removeFromHistory(dataToRemove: string) {
    //     storedQueries.splice(storedQueries.indexOf(dataToRemove), 1);
    //     localStorage.setItem('searchQueries', JSON.stringify(storedQueries));
    // }
    
    return (
        <div className={cn(`relative flex gap-6`, className)} ref={openedRef}>
            <div className="relative flex-grow" onSubmit={() => handleSearch(searchQuery)}>
                <Input
                    type="text"
                    onClick={() => setSearchMenu(!searchMenu)}
                    value={searchQuery}
                    onKeyDown={onEnterClick}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={"Наприклад: Front-End engineer"}
                    className="bg-[#F9FAFB] pr-10"
                />

                {searchQuery.length > 0 ? (
                        <X className="absolute top-1/2 right-3 h-5 text-[#D0D5DD] -translate-y-1/2 cursor-pointer" onClick={() => {setSearchQuery("")}}/>
                    )  : (<Search className="absolute top-1/2 right-3 h-5 text-[#D0D5DD] -translate-y-1/2 pointer-events-none" />)
                }

            </div>
            {
                searchMenu && storedQueries.length > 0 && (
                    <ul className="absolute z-50 top-12 left-0 w-full filters-list">
                        <li className="px-4 py-2 items-center text-common-blue">
                            Нещодавні запити
                        </li>
                        {
                           storedQueries.map((query: string, index: number) => (
                                <li
                                    key={index}
                                    className="filter-item input cursor-pointer flex gap-4 items-center"
                                    onClick={() => {setSearchQuery(query); handleSearch(query); setSearchMenu(false);}}
                                >
                                 <Clock className="size-4 mt-[1px]"/>{query}
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </div>
    );
};
