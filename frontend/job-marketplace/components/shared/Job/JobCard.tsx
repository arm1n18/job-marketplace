import { cn } from "@/lib/utils";
import { IsNew } from "@/components/ui/checkNewness";
import { NoImgAvatars } from "@/components/ui/noImgAvatars";
import Link from "next/link";
import { Job } from "@/types/job.type";
import { useRouter } from "next/navigation";

interface Props extends Job{
    data: Job;
    keyInfo: string[];
    onClick?: () => void;
    className ?: string;
}

export const JobCard: React.FC<Props> = ({ data, onClick, keyInfo, className }) => {
    const router = useRouter();
    const companyRedirect = (e: any) => {
        e.stopPropagation();
        router.push(`/company/${data.company_name!.replace(' ', '-')}`)
    }
        
    return (
        <div className={cn("rounded-lg p-4", className)} onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="w-full justify-between flex">
                <div className="flex items-center gap-3" onClick={companyRedirect}>
                   { data.image_url ? (
                        <img className="rounded-full w-6 h-6" src={data.image_url} alt={`${data.company_name} avatar`} />
                    ) : (<NoImgAvatars className="rounded-full w-6 h-6 text-xs" name={data.company_name!} />)}
                    <Link className="text-common-sm leading-none hover:underline" href={`/company/${data.company_name!.replace(' ', '-')}`}>{data.company_name}</Link>
                </div>

                <IsNew created_at={data.created_at?.toString() ?? ''} />
            </div>

            <h2 className="text-title my-3 leading-none">
                <Link href={`/jobs/${data.id}`} className="visited:text-[#4B1484]">{data.title}</Link>
            </h2>

            
            <p className="text-common-sm ln-clamp-3 mb-3 text-justify line-clamp-3 leading-[16px]">
                {data.description}
            </p>

            <div>
                <span className="text-salary leading-none">
                    {data.salary_from != 0 && `від $${data.salary_from} `}
                    {data.salary_to != 0 && data.salary_to && `до $${data.salary_to}`}
                </span>
            </div>

            {keyInfo?.length ? (
                <>
                    <div className="line-gray my-3" />
                    <div className="flex items-center gap-2 flex-wrap">
                        {keyInfo.map((key, index) => (
                            <span className="key-word-block" key={index}>{key}</span>
                        ))}
                    </div>
                </>
            ) : null}

            
        </div>
    )
}