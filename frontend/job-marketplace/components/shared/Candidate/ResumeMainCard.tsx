import { BreadCrumb, ResponseButtonsSection, Button, ParametersLine, SectionDescription, KeyWord, ApplyButtonRecruiter, AlertDialog  } from "@/components/ui";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { JobCard } from "../Job";
import { Share2, X } from "lucide-react";
import { JobCardSkeleton } from "../Skeletons";
import { Job, Resume } from "@/types";
import { Method, ResponseDataType } from "@/types/response.type";
import { useAuth, useOpenedRef, useWindowWidth } from "@/components/hook";
import ApplyService from "@/services/ApplyService";
import FetchDataService from "@/services/FetchDataService";
import { cn, copyURL } from "@/lib";
import ResumeService from "@/services/ResumeService";
import { EllipsisMenu } from "@/components/ui/EllipsisMenu";
import { toast } from "react-toastify";

interface Props{
    data: Resume;
    onApplyClick: (resumeID: number, status: string) => void;
    isMainPage?: boolean;
    resumeStatus: string;
    responseID?: number
    route?: string
    className ?: string;
}

const methods: { [key: string]: string } = {
    "OFFER_PENDING": "applyForResume",
    "SUCCEEDED": "acceptResume",
    "REJECTED": "rejectResume",
}

export const ResumeMainCard: React.FC<Props> = ({ data, isMainPage, className, onApplyClick, resumeStatus, route, responseID}) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [openedAlert, setOpenedAlert] = useState<boolean>(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [ jobsList, setJobsList ] = useState(false);
    const { role, id } = useAuth();
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const screenWidth = useWindowWidth();
    const [ loading, setLoading ] = useState(false);
    const openedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (jobsList) {
            const getJobs = new FetchDataService({url: "company/jobs", setLoading, setData: setJobs});
            getJobs.getData();
        }
    }, [jobsList]);
    
    
    const handleResponseClick = async (status: string) => {
        const selectedMethod = methods[status] as Method;

        const applyData: ResponseDataType = {
            method: selectedMethod,
            applyingForID: data.id!,
            recruiterID: id!,
            candidateID: data.creator_id!,
            jobID: selectedJob ? selectedJob.id : data!.id,
            responseID: responseID
        }

        const applyJobs = new ApplyService({role: role, data: applyData, jobID: data.id});

        setLoading(true);
        try {
            const response = await applyJobs.respond();
            if (response?.success && status != "OFFER_PENDING") {
                onApplyClick(data.id!, status);
            }
            toast.success("Пропозиція успішно відправлена!");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useOpenedRef({isOpen: isOpen, setIsOpen: setIsOpen, openedRef});

    return (
        <>  
            {openedAlert && (
                <AlertDialog
                    opened={openedAlert}
                    setOpened={setOpenedAlert}
                    title="Ви впевнені?"
                    description="Ця дія призведе до видалення вакансії, всіх пов'язних з нею відгуків та запропонованих пропозицій."
                    onConfirm={async () => {ResumeService.deleteResume(data.id!); setOpenedAlert(false);}}
                />
            )}
            <div className={cn("flex-grow md:border md:border-[#D0D5DD] rounded-lg sticky max-md:p-4 p-8", className)}>
                {isMainPage && <BreadCrumb items={[data.category_name!, data.subcategory_name!]} />}
                {
                    data.jobTitle && (
                        <>
                            <h3 className="flex gap-1"><p className="text-common-selected">Вакансія: </p> <Link className="text-common-blue hover:underline" href={`/jobs/${data.jobID}`}> {data.jobTitle}</Link></h3>
                            <div className="line-gray my-6" />
                        </>
                    )
                }
                <header className="w-full flex justify-between items-center">
                        <div className="w-full flex justify-between max-md:flex-col">
                                <div className="flex items-center justify-between">
                                <h2 className="text-title-bg leading-none max-md:mb-4 hover:underline"><Link href={`/candidates/${data.id}`}>{data.title}</Link></h2>
                                    {data.creator_id == id && screenWidth < 768 && (
                                        <EllipsisMenu isOpen={isOpen} openedAlert={openedAlert}
                                            setIsOpen={setIsOpen} setOpenedAlert={setOpenedAlert}
                                            openedRef={openedRef} data={data.id} url={"candidates"}
                                        />
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-salary-bg leading-none">${data.salary}{isMainPage ?  " / на місяць"  : ''}</span>
                                    {data.creator_id == id && screenWidth > 768 && (
                                        <EllipsisMenu isOpen={isOpen} openedAlert={openedAlert}
                                            setIsOpen={setIsOpen} setOpenedAlert={setOpenedAlert}
                                            openedRef={openedRef} data={data.id} url={"candidates"}
                                            className="max-md:hidden"
                                        />
                                    )}
                                </div>
                        </div>
                </header>

                {data.keywords?.length ? (
                    <>
                        <div className="flex items-center gap-3 flex-wrap mt-6">
                            {data.keywords && data.keywords.map((keyword, index) => (
                                <KeyWord className="key-word-block-bg" key={index} keyword={keyword} />
                            ))}
                        </div>
                    </>
                ) : null}
                    
                <div className="line-gray my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <ParametersLine IconName="PcCase" name="Напрямок:" description={`${data.subcategory_name || data.category_name}`}/>
                    <ParametersLine IconName="MapPin" name="Місто:" description={`${data.city_name || "Україна"}`}/>
                    <ParametersLine IconName="CalendarFold" name="Досвід:" description = {data.experience ? `${data.experience} ${data.experience > 4 ? "років" : (data.experience > 1 ? "роки" : "рік")} досвіду` : "Без досвіду" }/>
                    <ParametersLine IconName="BriefcaseBusiness" name="Зайнятість:" description={`${data.employment_name}`}/>
                </div>

                <div className="line-gray my-6" />

                <div>
                    <SectionDescription className="mb-6" title={"Досвід роботи"} description={data.work_experience} />
                    {data.achievements && data.achievements.length > 0 && (
                        <SectionDescription className="mb-6" title={"Досягнення"} description={data.achievements} />
                    )}

                </div>
                <div className="sticky bottom-0 w-full bg-white py-6 block">
                {
                    resumeStatus == "" || resumeStatus == "OFFER_PENDING" ? (
                        <div className="flex gap-2">
                            {role === "RECRUITER" && <Button variant={"outline"} onClick={() => copyURL(window.location.href)}><Share2 size={16}/></Button>}
                            <ApplyButtonRecruiter
                                className="w-full"
                                roleAccess={"RECRUITER"}
                                status={resumeStatus} 
                                loading={loading}
                                jobsList={jobsList}
                                setJobsList={setJobsList}
                            />
                        </div>
                    ) : (
                        <ResponseButtonsSection
                            className="w-full"
                            status={resumeStatus}
                            loading={loading}    
                            onClick={(status) => handleResponseClick(status)}
                            id={responseID}
                            route={route}
                        />
                    )
                }
                </div>
            </div>
            {
                jobsList && (
                    <div className="overlay overflow-hidden absolute flex items-center top-0 right-0 h-full" ref={openedRef}>
                        <div className="bg-white p-4 top-0 right-0 h-full ml-auto flex flex-col">
                            <X className="w-4 h-4 mb-4 text-common cursor-pointer" onClick={() => setJobsList(!jobsList)}/>
                            <div className="flex flex-col overflow-auto scrollbar">
                                {loading && Array.from({ length: 3 }).map((_, index) => (
                                    <JobCardSkeleton key={index} className={`${index != 2 ? 'mb-3' : ''} w-[448px]`}/>
                                ))}
                                {!loading && jobs != null && jobs.length > 0 && jobs.map((job, index: number) => (
                                        <JobCard
                                        className={`${index != jobs.length - 1 ? 'mb-3' : ''} ${selectedJob === job ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200 w-full max-w-md`}
                                        key={job.id}
                                        onClick={() => setSelectedJob(job)}
                                        data={job}
                                        keyInfo={[
                                            job.city_name || "Україна",
                                            job.employment_name ?? "",
                                            job.experience
                                                ? `${job.experience.toString()} ${job.experience > 4 ? "років" : (job.experience > 1 ? "роки" : "рік")} досвіду`
                                                : "Без досвіду",
                                            job.subcategory_name ?? job.category_name ?? "",
                                        ]}/>
                                    ))}
                            </div>
                                <Button className="max-w-md w-full mt-4"
                                    disabled={loading}
                                    onClick={() =>{handleResponseClick("OFFER_PENDING");
                                    setJobsList(!jobsList)}}>
                                        Запропонувати вакансію
                                </Button>
                        </div>
                    </div> 
                )
            }
        </>
    )
}