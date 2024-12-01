import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";


interface Props{
    className ?: string;
}

export const CompanyCardSkeleton: React.FC<Props> = ({ className }) => {
        
    return (
        <div className={cn("rounded-lg p-8 bg-gray-selected w-full", className)}>
            <header className="w-full flex max-sm:flex-col justify-between sm:items-center">
                <div className="flex items-center gap-6 sm:justify-between">
                    <Skeleton className="h-16 w-16 rounded-[8px]" />
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
                <div className="flex gap-3 max-sm:mt-6">
                    <div className="flex gap-2"><Skeleton className="h-7 w-7"/><Skeleton className="h-6 w-16 my-auto"/></div>
                    <div className="flex gap-2"><Skeleton className="h-7 w-7"/><Skeleton className="h-6 w-20 my-auto"/></div>
                </div>
            </header>

            <div className="border-gray-primary my-6" />

            <Skeleton className="h-6 w-24 mb-6" />             
            <Skeleton className="h-36 w-full mb-6" />
        </div>
    )
}