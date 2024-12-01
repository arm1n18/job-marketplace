import { cn } from "@/lib/utils";

interface Props {
    className ?: string;
}

export const CandidateProfileSkeleton: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn("", className)}>
            
        </div>
    )
}