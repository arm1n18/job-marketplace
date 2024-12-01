import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props{
    className ?: string;
}

export const ResumeCardSkeleton: React.FC<Props> = ({ className }) => {
    return (
        <div 
            className={cn("rounded-lg p-4 bg-gray-selected", className)} 
        >
            <div className="w-full flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-32"/>
                <Skeleton className="h-5 w-20"/>
            </div>
            <Skeleton className="h-3 w-32 mb-3"/>
            <Skeleton className="h-5 w-20 mb-3"/>
            <Skeleton className="h-44 w-full mb-3"/>
            <Skeleton className="h-3 w-24"/>
            <div className="border-gray-primary my-3" />
                <div className="flex items-center gap-3 flex-wrap">
                    <Skeleton className="h-6 w-20 rounded-sm" />
                    <Skeleton className="h-6 w-14 rounded-sm" />
                    <Skeleton className="h-6 w-24 rounded-sm" />
                    <Skeleton className="h-6 w-16 rounded-sm" />
            </div>
        </div>
    )
}