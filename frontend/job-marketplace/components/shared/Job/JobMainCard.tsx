'use client'

import { ApplyButton, KeyWord, NoImgAvatars, ParametersLine, ResponseButtonsSection, SectionDescription, AlertDialog, BreadCrumb, Button } from "@/components/ui";
import { cn, copyURL } from "@/lib";
import { EllipsisVertical, PencilLine, Share2, Trash2, User } from "lucide-react";
import { useAuth, useWindowWidth, useOpenedRef } from "@/components/hook";
import { KeywordsType, ResponseDataType } from "@/types";
import Link from "next/link";
import ApplyService from "@/services/ApplyService";
import { Job } from "@/types/job.type";
import { useRef, useState } from "react";
import { Method } from "@/types/response.type";
import JobsService from "@/services/JobsService";
import { useRouter } from "next/navigation";
import { EllipsisMenu } from "@/components/ui/EllipsisMenu";


interface Props{
    data: Job;
    keywords: KeywordsType[];
    keyInfo?: string[];
    onApplyClick: (jobID: number, status: string) => void;
    jobStatus: string;
    isMainPage?: boolean;
    responseID?: number
    route?: string
    className ?: string;
}

const methods: { [key: string]: string } = {
    "APPLICATION_PENDING": "applyForJob",
    "SUCCEEDED": "acceptJob",
    "REJECTED": "rejectJob",
}


export const JobMainCard: React.FC<Props> = ({ data, keywords, className, jobStatus, isMainPage, onApplyClick, responseID, route}) => {
    const { role, id, loggedIn } = useAuth();
    const [ loading, setLoading ] = useState(false);
    const screenWidth = useWindowWidth();
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [openedAlert, setOpenedAlert] = useState<boolean>(false);
    const openedRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useOpenedRef({isOpen: isOpen, setIsOpen: setIsOpen, openedRef});

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
        } finally {
            setLoading(false);
        }
    }

    return (
        <>  
            {openedAlert && (
                <AlertDialog
                    opened={openedAlert}
                    setOpened={setOpenedAlert}
                    title="Ви впевнені?"
                    description="Ця дія призведе до видалення вакансії, всіх пов'язних з нею відгуків та запропонованих пропозицій."
                    onConfirm={async () => {JobsService.deleteJob(data.id!), setOpenedAlert(false)}}
                />
            )}
            <div className={cn("flex-grow md:border md:border-[#D0D5DD] rounded-lg sticky max-md:p-4 p-8", className)}>
                {isMainPage && <BreadCrumb items={[data.category_name!, data.subcategory_name!, data.company_name!]} />}
                <header className="w-full flex justify-between items-center">
                        <div className="flex md:items-center gap-6 max-md:flex-col w-full">
                            <div className="max-md:flex max-md:items-center max-md:gap-4">
                                <Link href={`/company/${data.company_name!.replace(' ', '-')}`}>
                                    {
                                        data.image_url ? (
                                            <img className="rounded-xl size-12 md:size-16 object-cover " loading="lazy" src={data.image_url} alt={`${data.company_name} logo`} />
                                        ) : (<NoImgAvatars className="rounded-xl size-12 md:size-16 text-2xl" name={data.company_name!} />)
                                    }
                                </Link>
                                <div className="flex justify-between items-center w-full">
                                    <Link className="text-title-dark md hover:underline leading-none gap-1 w-fit flex md:hidden" href={`/company/${data.company_name!.replace(' ', '-')}`}>
                                        {data.company_name}
                                    </Link>
                                    {data.creator_id == id && screenWidth < 768 && (
                                        <EllipsisMenu isOpen={isOpen} openedAlert={openedAlert}
                                            setIsOpen={setIsOpen} setOpenedAlert={setOpenedAlert}
                                            openedRef={openedRef} data={data.id} url={"jobs"} 
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center gap-3">
                                <h2 className="text-title-bg leading-none">{data.title}</h2>
                                <Link className="text-common-sm hover:underline leading-none gap-1 w-fit hidden md:flex" href={`/company/${data.company_name!.replace(' ', '-')}`}>
                                    {data.company_name}
                                    <User className="size-3" strokeWidth={3} />
                                </Link>
                            </div>
                        </div>
                        {data.creator_id == id && screenWidth > 768 && (
                            <EllipsisMenu isOpen={isOpen} openedAlert={openedAlert}
                                setIsOpen={setIsOpen} setOpenedAlert={setOpenedAlert}
                                openedRef={openedRef} data={data.id} url={"jobs"} 
                            />
                        )}
                        { role == "CANDIDATE" && (
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
                                    route={route}
                                    id={responseID}
                                    onClick={(status) => handleResponseClick(status)}
                                />
                            ))
                        }
                </header>

                <div className="my-6">
                    <span className="text-salary-bg leading-none">
                        {data.salary_from != 0 && `від $${data.salary_from} `}
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
                                            <div className="flex gap-2 w-full">
                                                <Button variant={"outline"} onClick={() => copyURL(window.location.href)}><Share2 size={16}/></Button>
                                                <ApplyButton
                                                    className="w-full"
                                                    roleAccess={"CANDIDATE"}
                                                    status={jobStatus} 
                                                    loading={loading}
                                                    onClick={() => handleResponseClick("APPLICATION_PENDING")} 
                                                />
                                            </div>
                                        ) : (
                                            <ResponseButtonsSection
                                                className="w-full"
                                                id={data.application_id!}
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