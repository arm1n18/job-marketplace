import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
    className ?: string;
}

export const JobMainCardSkeleton: React.FC<Props> = ({ className }) => {
    return (
        
        <>  
            <div className={cn("flex-grow bg-gray-selected rounded-lg sticky p-8", className)}>
                <header className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-6 justify-between">
                            <Skeleton className="h-16 w-16 rounded-[8px]" />
                            <div className="flex flex-col gap-3">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-32" />
                </header>

                <div className="my-6">
                    <Skeleton className="h-8 w-56" />
                </div>

                <div className="border-gray-primary my-6" />

                <div className="flex items-center gap-3 flex-wrap">
                    <Skeleton className="h-8 w-20 rounded-sm" />
                    <Skeleton className="h-8 w-14 rounded-sm" />
                    <Skeleton className="h-8 w-24 rounded-sm" />
                    <Skeleton className="h-8 w-16 rounded-sm" />
                </div>

                <div className="border-gray-primary my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Skeleton className="h-6 max-w-64" />
                    <Skeleton className="h-6 max-w-64" />
                    <Skeleton className="h-6 max-w-64" />
                    <Skeleton className="h-6 max-w-64" />
                    <Skeleton className="h-6 max-w-64" />
                    <Skeleton className="h-6 max-w-64" />
                </div>

                <div className="border-gray-primary my-6" />

                <div>
                    <Skeleton className="h-6 w-24 mb-6" />             
                    <Skeleton className="h-60 w-full mb-6" />
                    <Skeleton className="h-6 w-24 mb-6" />             
                    <Skeleton className="h-96 w-full mb-6" /> 
                    <Skeleton className="h-6 w-24 mb-6" />             
                    <Skeleton className="h-96 w-full mb-6" />           
                </div>
            </div>
        </>
    )
}