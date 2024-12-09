import { cn } from "@/lib/utils";

interface Props {
    title?: string;
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
                {title && <p className="text-common-dark">{title}</p>}
                <div className="text-common text-justify my-4 break-words whitespace-normal">{description}</div>
            </div>
        </>
    );
}