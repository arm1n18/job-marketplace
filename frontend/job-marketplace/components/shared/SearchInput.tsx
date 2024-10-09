import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface Props {
    className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn("relative flex gap-6", className)}>
            <div className="relative flex-grow">
                <Input
                    placeholder="Наприклад: Front-end engineer"
                    className="bg-[#F9FAFB]"
                />
                <Search className="absolute top-1/2 right-3 h-5 text-[#D0D5DD] -translate-y-1/2 pointer-events-none" />
            </div>
            
            <Button className="w-[160px]">
                Пошук
            </Button>
        </div>
    );
};
