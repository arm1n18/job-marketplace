import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    onSearch: (query: string) => void;
    value?: string;
    className?: string;
}


export const SearchInput: React.FC<Props> = ({ className, onSearch, value }) => {
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setSearchQuery(value || "");
    }, [value]);

    const handleSearch = async() => {
        try {
            onSearch(searchQuery);
        } catch(err) {
            console.error("Error fetching search results:", err);
        }
    }
    
    const onEnterClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            handleSearch();
        }
    }
    
    return (
        <div className={cn("relative flex gap-6", className)}>
            <div className="relative flex-grow" onSubmit={handleSearch}>
                <Input
                    type="text"
                    value={searchQuery}
                    onKeyDown={onEnterClick}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={"Наприклад: Front-End engineer"}
                    className="bg-[#F9FAFB] pr-10"
                />

                {searchQuery.length > 0 ? (
                        <X className="absolute top-1/2 right-3 h-5 text-[#D0D5DD] -translate-y-1/2 cursor-pointer" onClick={() => setSearchQuery("")}/>
                    )  : (<Search className="absolute top-1/2 right-3 h-5 text-[#D0D5DD] -translate-y-1/2 pointer-events-none" />)
                }

            </div>
            
        </div>
    );
};
