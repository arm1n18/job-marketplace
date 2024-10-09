import { cn } from "@/lib/utils";
import { Resume } from "./ResumeDetailsTypes";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { KeywordsType } from "@/types/types";



interface Props extends Resume{
    keywords: KeywordsType[];
    onClick?: () => void;
    className ?: string;
}

export const ResumeCard: React.FC<Props> = ({
    title,
    work_experience,
    salary,
    city_name,
    experience,
    category_name,
    subcategory_name,
    keywords,
    achievements,
    onClick,
    className }) => {

        const [isExpanded, setIsExpanded] = useState(false);
        
        const handleExpand = (event: React.MouseEvent) => {
            event.stopPropagation();
            setIsExpanded(!isExpanded);
        }
        
    return (
        <div 
            className={cn("w-[438px] rounded-lg p-5 bg-gray-selected", className)} 
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="w-full flex items-center justify-between mb-3">
                <h2 className="text-title-bg leading-none"><a href={""}>{title}</a></h2>
                <span className="text-salary-bg leading-none">
                    {salary && `від $${salary} `}
                </span>
            </div>
            <p className="text-common-sm leading-none mb-3">Україна 
                {city_name && ` • ${city_name}`} • {experience} {experience > 5 ? "років" : (experience > 1 ? "роки" : "рік")} досвіду
                • {subcategory_name || category_name}
                </p>

            
                <div className={`${isExpanded == true ? "" : " max-h-36 overflow-hidden"} mb-3`}>
                <p className="text-common-sm text-justify leading-[16px]">
                    {work_experience}
                </p>
                {/* <p className="text-common-sm text-justify leading-[16px]">
                    {achievements}
                </p> */}
            </div>
            {
                work_experience?.length > 1023 ? 
                    <span className="text text-common-sm-blue" onClick={handleExpand}>{isExpanded ?
                        <span className="flex items-center">Приховати <ChevronUp className="size-4 ml-1 mt-[2px]" /></span>
                        : <span className="flex items-center">Детальніше <ChevronDown className="size-4 ml-1 mt-[2px]" /></span>
                    }</span>
                : null
            }
            
            {keywords?.length ? (
                <>
                    <div className="border-gray-primary my-3" />
                    <div className="flex items-center gap-3 flex-wrap">
                        {keywords.map((key, index) => (
                            <span className="key-word-block" key={index}>{key.name}</span>
                        ))}
                    </div>
                </>
            ) : null}

            
        </div>
    )
}