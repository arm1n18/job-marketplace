import { cn } from "@/lib/utils";

interface Props {
    title: string;
    description: any;
    className?: string;
}

export const SectionDescription: React.FC<Props> = ({
    title,
    description,
    className
}) => {
    return (
        <>  
            <div className={cn("", className)}>
                <p className="mb-6 text-common-dark">{title}</p>
                <div className="text-common text-justify">{description}</div>
            </div>
        </>
    );
}