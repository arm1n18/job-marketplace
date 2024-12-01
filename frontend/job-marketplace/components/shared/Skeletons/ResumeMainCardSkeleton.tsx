import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props{
    isMainPage ?: boolean;
    className ?: string;
}

export const ResumeMainCardSkeleton: React.FC<Props> = ({ isMainPage, className }) => {
    return (
        <>  
            <div className={cn("flex-grow md:bg-[#F7F7F8] md:border md:border-[#D0D5DD] rounded-lg sticky max-sm:p-4 p-8", className)}>
                <header className="w-full flex justify-between items-center">
                        <div className="w-full flex justify-between">
                        <Skeleton className="h-6 w-60" />
                        {/* <Skeleton className={`${isMainPage ? 'h-6 w-40' : 'h-6 w-28'}`} /> */}
                        </div>
                </header>

                <div className="flex items-center gap-3 flex-wrap  mt-6">
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
                </div>


                <div className="border-gray-primary my-6" />

                <div>
                    <Skeleton className="h-6 w-24 mb-6" />             
                    <Skeleton className="h-48 w-full mb-6" />
                    <Skeleton className="h-6 w-24 mb-6" />             
                    <Skeleton className="h-36 w-full mb-6" />
                </div>
                
                <div className="w-full align-end">
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </>
    )
}