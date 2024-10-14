import { cn } from "@/lib/utils";
import { Job } from "./JobDetailsTypes";
import { IsNew } from "@/components/ui/checkNewness";
import { NoImgAvatars } from "@/components/ui/noImgAvatars";

interface Props extends Job{
    keyInfo: string[];
    onClick?: () => void;
    className ?: string;
}

export const JobCard: React.FC<Props> = ({
    image_url,
    id,
    company_name,
    title,
    description,
    salary_from,
    salary_to,
    keyInfo,
    onClick,
    created_at,
    className }) => {
        
    return (
        <div 
            className={cn("w-96 rounded-lg p-5 bg-gray-selected", className)} 
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="w-full justify-between flex">
                <div className="flex items-center gap-3">
                   { image_url ? (
                        <img className="rounded-full w-6 h-6" src={image_url} alt="" />
                    ) : (<NoImgAvatars className="rounded-full w-6 h-6 text-[12px]" companyName={company_name} />)}
                    <a className="text-common-sm leading-none hover:underline" href={`/company/${company_name.replace(' ', '-')}`}>{company_name}</a>
                </div>

                <IsNew created_at={created_at?.toString() ?? ''} />
            </div>

            <h2 className="text-title my-3 leading-none">
                <a href={`/jobs/${id}`} target="_blank">{title}</a>
            </h2>

            
            <p className="text-common-sm ln-clamp-3 mb-3 text-justify line-clamp-3 leading-[16px]">
                {description}
            </p>

            <div>
                <span className="text-salary leading-none">
                    {salary_from && `від $${salary_from} `}
                    {salary_to && `до $${salary_to}`}
                </span>
            </div>

            {keyInfo?.length ? (
                <>
                    <div className="border-gray-primary my-3" />
                    <div className="flex items-center gap-3 flex-wrap">
                        {keyInfo.map((key, index) => (
                            <span className="key-word-block" key={index}>{key}</span>
                        ))}
                    </div>
                </>
            ) : null}

            
        </div>
    )
}