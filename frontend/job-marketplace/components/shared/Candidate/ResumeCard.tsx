import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Resume } from "@/types";
import ResumeService from "@/services/ResumeService";
import { usePathname } from 'next/navigation';

interface Props{
    data: Resume;
    onClick?: () => void;
    className ?: string;
}

export const ResumeCard: React.FC<Props> = ({
    data,
    onClick,
    className }) => {

        const [isExpanded, setIsExpanded] = useState(false);
        const handleExpand = (event: React.MouseEvent) => {
            event.stopPropagation();
            setIsExpanded(!isExpanded);
        }
    
    const router = usePathname();
    const offerOrApplication = data.offerID != 0 ? "application" : "offer";
    const responseID = data.offerID != 0 ? data.offerID : data.applicationID;
        
    return (
        <div 
            className={cn("rounded-lg p-4 bg-gray-selected", className)} 
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
             {
                data.jobTitle && (
                    <>
                        <h3 className="flex gap-1"><p className="text-common-selected">Вакансія: </p> <Link className="text-common-blue hover:underline" href={`/jobs/${data.jobID}`}> {data.jobTitle}</Link></h3>
                        <div className="line-gray my-2" />
                    </>
                )
            }
            <div className="w-full flex items-center justify-between mb-3">
            
                <h2 className="text-title leading-none w-fit max-w-72"><Link href={router.startsWith("/candidates") ? `candidates/${data.id}` : `/response/candidate/${data.id}?${offerOrApplication}=${responseID}`} className="visited:text-[#4B1484] hover:underline">{data.title}</Link></h2>
                <span className="text-salary leading-none ml-2">
                    {data.salary && `від $${data.salary} `}
                </span>
            </div>
            <p className="text-common-sm leading-none mb-3">Україна 
                {data.city_name && ` • ${data.city_name}`} • {ResumeService.formatExperience(data.experience!)}
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
            
            {data.keywords?.length ? (
                <>
                    <div className="line-gray my-3" />
                    <div className="flex items-center gap-1 flex-wrap">
                        {data.keywords.slice(0, 10).map((keyword, index) => (
                            <span className="key-word-block" key={index}>{keyword}</span>
                        ))}
                        {data.keywords.length > 10 ? <span className="key-word-block">+{data.keywords.length - 10}</span> : null}
                    </div>
                </>
            ) : null}

            
        </div>
    )
}