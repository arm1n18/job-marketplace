import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { KeywordsType } from "@/types/types";
import Link from "next/link";
import { Resume } from "@/types";

interface Props{
    data: Resume;
    keywords: KeywordsType[];
    onClick?: () => void;
    className ?: string;
}

export const ResumeCard: React.FC<Props> = ({
    data,
    keywords,
    onClick,
    className }) => {

        const [isExpanded, setIsExpanded] = useState(false);
        const handleExpand = (event: React.MouseEvent) => {
            event.stopPropagation();
            setIsExpanded(!isExpanded);
        }
        
    return (
        <div 
            className={cn("rounded-lg p-4 bg-gray-selected", className)} 
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="w-full flex items-center justify-between mb-3">
                <h2 className="text-title leading-none w-fit max-w-72"><Link href={`/candidates/${data.id}`} className="visited:text-[#4B1484]">{data.title}</Link></h2>
                <span className="text-salary leading-none ml-2">
                    {data.salary && `від $${data.salary} `}
                </span>
            </div>
            <p className="text-common-sm leading-none mb-3">Україна 
                {data.city_name && ` • ${data.city_name}`} • {data.experience} {data.experience! > 4 ? "років" : (data.experience! > 1 ? "роки" : "рік")} досвіду
                • {data.subcategory_name || data.category_name}
                </p>

            
                <div className={`${isExpanded == true ? "" : " max-h-36 overflow-hidden"} mb-3`}>
                <p className="text-common-sm text-justify leading-[16px]">
                    {data.work_experience}
                </p>
                {/* <p className="text-common-sm text-justify leading-[16px]">
                    {achievements}
                </p> */}
            </div>
            {
                (data.work_experience ?? "").length > 1023 ? 
                    <span className="text text-common-sm-blue" onClick={handleExpand}>{isExpanded ?
                        <span className="flex items-center">Приховати <ChevronUp className="size-4 ml-1 mt-[2px]" /></span>
                        : <span className="flex items-center">Детальніше <ChevronDown className="size-4 ml-1 mt-[2px]" /></span>
                    }</span>
                : null
            }
            
            {keywords?.length ? (
                <>
                    <div className="line-gray my-3" />
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