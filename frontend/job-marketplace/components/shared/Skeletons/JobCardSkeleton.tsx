import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
    className ?: string;
}

export const JobCardSkeleton: React.FC<Props> = ({ className }) => {
        
    return (
        <div 
            className={cn("rounded-lg p-4 bg-gray-selected mb-3", className)} 
            style={{ cursor: 'pointer' }}
        >
            <div className="w-full justify-between flex">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-12" />
            </div>

            <h2 className="my-3">
                <Skeleton className="h-4 w-40" />
            </h2>

            <div className="space-y-2 mb-3">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-full" />
            </div>

            <div>
                <Skeleton className="h-5 w-36" />
            </div>

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