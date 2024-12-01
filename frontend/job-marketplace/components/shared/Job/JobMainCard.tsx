'use client'

import { cn } from "@/lib/utils";
import { KeyWord } from "../../ui/key-word";
import { Check, User, X } from "lucide-react";
import { SectionDescription } from "@/components/ui/section-description";
import { ParametersLine } from "@/components/ui/parametrs-line";
import { NoImgAvatars } from "@/components/ui/noImgAvatars";
import { ApplyButton } from "@/components/ui/applyButton";
import { useAuth } from "@/components/hook/AuthContext";
import { KeywordsType, ResponseDataType } from "@/types";
import Link from "next/link";
import ApplyService from "@/services/ApplyService";
import { Job } from "@/types/job.type";
import { useState } from "react";
import { useWindowWidth } from "@/components/hook/useWindowWidth";
import { ResponseButtonsSection } from "@/components/ui/responseButtonsSection";
import { Method } from "@/types/response.type";


interface Props{
    data: Job;
    keywords: KeywordsType[];
    keyInfo?: string[];
    onApplyClick: (jobID: number, status: string) => void;
    jobStatus: string;
    className ?: string;
}

const methods: { [key: string]: string } = {
    "APPLICATION_PENDING": "applyForJob",
    "SUCCEEDED": "acceptJob",
    "REJECTED": "rejectJob",
}


export const JobMainCard: React.FC<Props> = ({ data, keywords, className, jobStatus, onApplyClick }) => {
    const { role, id, loggedIn } = useAuth();
    const [ loading, setLoading ] = useState(false);
    const screenWidth = useWindowWidth();

    const handleResponseClick = async (status: string) => {
        const selectedMethod = methods[status] as Method;

        const applyData: ResponseDataType = {
            method: selectedMethod,
            applyingForID: data.id!,
            recruiterID: data.creator_id!,
            candidateID: id!,
        }
    
        const applyJobs = new ApplyService({role: role, data: applyData, jobID: data.id});
        setLoading(true);
        try {
            const response = await applyJobs.respond();
            if (response.success) {
                onApplyClick(data.id!, status);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    return (

        <>  
            <div className={cn("flex-grow md:border md:border-[#D0D5DD] rounded-lg sticky max-md:p-4 p-8", className)}>
                <header className="w-full flex justify-between items-center">
                        <div className="flex md:items-center gap-6 max-md:flex-col">
                            <div className="max-md:flex max-md:items-center max-md:gap-4">
                                <Link href={`/company/${data.company_name!.replace(' ', '-')}`}>
                                    {
                                        data.image_url ? (
                                            <img className="rounded-xl size-12 md:size-16 object-cover " loading="lazy" src={data.image_url} alt={`${data.company_name} logo`} />
                                        ) : (<NoImgAvatars className="rounded-xl size-12 md:size-16 text-2xl" name={data.company_name!} />)
                                    }
                                </Link>
                                <Link className="text-title-dark md hover:underline leading-none gap-1 w-fit flex md:hidden" href={`/company/${data.company_name!.replace(' ', '-')}`}>
                                    {data.company_name}
                                </Link>
                            </div>
                            <div className="flex flex-col justify-center gap-3">
                                <h2 className="text-title-bg leading-none">{data.title}</h2>
                                <Link className="text-common-sm hover:underline leading-none gap-1 w-fit hidden md:flex" href={`/company/${data.company_name!.replace(' ', '-')}`}>
                                    {data.company_name}
                                    <User className="size-3" strokeWidth={3} />
                                </Link>
                            </div>
                        </div>
                        {
                            jobStatus == "" || jobStatus == "APPLICATION_PENDING" ? (
                                <ApplyButton
                                    className="hidden md:block"
                                    roleAccess={"CANDIDATE"}
                                    status={jobStatus} 
                                    loading={loading}
                                    onClick={() => handleResponseClick("APPLICATION_PENDING")} 
                                />
                            ) : (
                                <ResponseButtonsSection
                                    className="hidden md:block"
                                    status={jobStatus}
                                    loading={loading}    
                                    onClick={(status) => handleResponseClick(status)}
                                />
                            )
                        }
                </header>

                <div className="my-6">
                    <span className="text-salary-bg leading-none">
                        {data.salary_from && data.salary_from != 0 && `від $${data.salary_from} `}
                        {data.salary_to != 0 && data.salary_to &&`до $${data.salary_to}`}
                    </span>
                </div>
                {keywords?.length ? (
                    <>
                        <div className="flex items-center gap-3 flex-wrap">
                            {keywords.map((keyword) => (
                                <KeyWord className="key-word-block-bg" key={keyword.id} keyword={keyword.name} />
                            ))}
                        </div>
                    </>
                ) : null}

                <div className="line-gray my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <ParametersLine IconName="PcCase" name="Напрямок:" description={`${data.subcategory_name || data.category_name}`}/>
                    <ParametersLine IconName="BriefcaseBusiness" name="Зайнятість:" description={`${data.employment_name}`}/>
                    <ParametersLine IconName="CalendarFold" name="Досвід:" description={data.experience ? `від ${data.experience} ${data.experience > 1 ? "років" : "року"}` : "Без досвіду" }/>
                    <ParametersLine IconName="Building" name="Офіс:" description={`${data.city_name || "Ні"}`}/>
                    <ParametersLine IconName="MapPin" name="Кандидат з:" description={`${data.city_name || "Україна"}`}/>
                    <ParametersLine IconName="CalendarClock" name="Опубліковано:" description={data.created_at && new Date(data.created_at).toLocaleDateString("uk-UA", {day: "numeric", month: "long"})}/>
                </div>

                <div className="line-gray my-6" />

                <div>
                    <SectionDescription className="mb-6" title={"Про нас"} description={data.about_us} />
                    <SectionDescription className="mb-6" title={"Обов’язки:"}
                        description={
                            <ul className="list-disc pl-5">
                                {data.description?.split('\n').map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        } />
                    <SectionDescription
                        className="mb-6"
                        title={"Вимоги:"} 
                        description={<ul className="list-disc pl-5">
                            {data.requirements?.split('\n').map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>} 
                    />
                    <SectionDescription 
                    title={"Умови роботи:"} 
                    description={<ul className="list-disc pl-5">
                        {data.offer?.split('\n').map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>} 
                    />
                    {
                        screenWidth < 768 && loggedIn && role === "CANDIDATE" && (
                            <div className="sticky bottom-0 w-full bg-white py-6 block">
                                <div className="flex gap-6 mb-2">
                                    {
                                        jobStatus == "" || jobStatus == "APPLICATION_PENDING" ? (
                                            <ApplyButton
                                                className="w-full"
                                                roleAccess={"CANDIDATE"}
                                                status={jobStatus} 
                                                loading={loading}
                                                onClick={() => handleResponseClick("APPLICATION_PENDING")} 
                                            />
                                        ) : (
                                            <ResponseButtonsSection
                                                className="w-full"
                                                status={jobStatus}
                                                loading={loading}    
                                                onClick={(status) => handleResponseClick(status)}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }                  
                </div>
                
            </div>
        </>
    )
}