import { cn } from "@/lib/utils";
import { KeyWord } from "../../ui/key-word";
import { KeywordsType } from "@/types/types";
import { SectionDescription } from "@/components/ui/section-description";
import { ParametersLine } from "@/components/ui/parametrs-line";
import { useAuth } from "@/components/hook/AuthContext";
import { Resume } from "@/types/resume.type";
import { ResponseDataType } from "@/types/response.type";
import { useEffect, useRef, useState } from "react";
import ApplyService from "@/services/ApplyService";
import { ApplyButtonRecruiter } from "@/components/ui/applyButtonRecuiter";
import Link from "next/link";
import { Job } from "@/types";
import FetchDataService from "@/services/FetchDataService";
import { JobCard } from "../Job";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ResponseButtonsSection } from "@/components/ui/responseButtonsSection";
import CompanyService from "@/services/CompanyService";

interface Props{
    data: Resume;
    keywords?: KeywordsType[];
    onApplyClick: () => void;
    isMainPage?: boolean;
    resumeStatus: string;
    className ?: string;
}

export const ResumeMainCard: React.FC<Props> = ({ data, isMainPage, keywords, className, onApplyClick, resumeStatus}) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [ jobsList, setJobsList ] = useState(false);
    const { role, id } = useAuth();
    const [ loading, setLoading ] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const openedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (jobsList) {
            const getCompanyJobs = new CompanyService({id: data.company_id!, setLoading: setLoading, setCompanyJobs: setJobs});
            getCompanyJobs.fetchCompanyJobs();
        }
    }, [jobsList]);

    useEffect(() => {
        if (!overlayRef.current) {
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            overlayRef.current = overlay;
        }
        
        const overlay = overlayRef.current;

        if (typeof window !== 'undefined') {
            if(jobsList) {
                document.body.style.overflow = 'hidden';
                document.body.appendChild(overlay);
            } else {
                document.body.style.overflow = '';
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }
        }
        
        const handleClickOutside = (e: MouseEvent) => {
            e.stopPropagation();
            if(jobsList && openedRef.current && !openedRef.current.contains(e.target as HTMLElement)) {
                setJobsList(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
    }, [jobsList]);
    
    const applyData: ResponseDataType = {
        method: "applyForResume",
        applyingForID: data.id!,
        recruiterID: data.creator_id!,
        candidateID: id!,
        jobID: selectedJob?.id
    }

    const applyJobs = new ApplyService({role: role, data: applyData, jobID: data.id});

    const handleResponseClick = async () => {
        console.log(applyData);
        if(data.status.String == "") {
            setLoading(true);
            try {
                const response = await applyJobs.respond();
                if (response.success) {
                    onApplyClick();
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
    }
    return (
        <>  
            <div className={cn("flex-grow md:border md:border-[#D0D5DD] rounded-lg sticky max-md:p-4 p-8", className)}>
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
                                <h2 className="text-title-bg leading-none max-md:mb-4">{data.title}</h2>
                                <span className="text-salary-bg leading-none">${data.salary}{isMainPage ?  " / на місяць"  : ''}</span>
                        </div>
                </header>

                {keywords?.length ? (
                    <>
                        <div className="flex items-center gap-3 flex-wrap mt-6">
                            {keywords.map((keyword) => (
                                <KeyWord className="key-word-block-bg" key={keyword.id} keyword={keyword.name} />
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

                {
                    resumeStatus == "" || resumeStatus == "OFFER_PENDING" ? (
                        <ApplyButtonRecruiter
                            className="w-full"
                            roleAccess={"RECRUITER"}
                            status={resumeStatus} 
                            loading={loading}
                            jobsList={jobsList}
                            setJobsList={setJobsList}
                        />
                    ) : (
                        <ResponseButtonsSection
                            className="w-full"
                            status={resumeStatus}
                            loading={loading}    
                            onClick={() => handleResponseClick()}
                        />
                    )
                }
                
            </div>
            {
                // jobsList && (
                //     <div className="z-30 filters-list offer h-5/6 overflow-auto scrollbar absolute top-64 left-0 right-0 mx-auto max-w-md">
                        
                //         {jobs != null && jobs.length > 0 && jobs.map((job, index: number) => (
                            
                //         <>
                //             <JobCard
                //             className={`${index != jobs.length - 1 ? 'mb-3' : ''} ${selectedJob === job ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200 max-w-md`}
                //             key={job.id}
                //             onClick={() => setSelectedJob(job)}
                //             data={job}
                //             keyInfo={[
                //                 job.city_name || "Україна",
                //                 job.employment_name ?? "",
                //                 job.experience
                //                     ? `${job.experience.toString()} ${job.experience > 4 ? "років" : (job.experience > 1 ? "роки" : "рік")} досвіду`
                //                     : "Без досвіду",
                //                 job.subcategory_name ?? job.category_name ?? "",
                //             ]}/>

                //         </>
                //         ))}
                //             <div className="sticky -bottom-4 w-full bg-white py-4 flex gap-8">
                //                 <span className="text-common-blue my-auto">Скасувати</span>
                //                 <Button className="w-full" onClick={() =>{handleResponseClick(), setJobsList(!jobsList)}}>Запропонувати вакансію</Button>
                //             </div>
                // </div> 
                // )
                jobsList && (
                    <div className="w z-30 fixed max-w-md top-0 right-0 h-screen overflow-y-auto bg-white p-4" ref={openedRef}>
                        <X className="w-4 h-4 mb-4 text-common cursor-pointer" onClick={() => setJobsList(!jobsList)}/>
                        {jobs != null && jobs.length > 0 && jobs.map((job, index: number) => (
                                <JobCard
                                className={`${index != jobs.length - 1 ? 'mb-3' : ''} ${selectedJob === job ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200 max-w-md`}
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
                        <div className="fixed bottom-0  bg-white py-4 w-[416px]">
                            <Button className="w-[416px]" onClick={() =>{handleResponseClick(), setJobsList(!jobsList)}}>Запропонувати вакансію</Button>
                        </div>
                    </div> 
                )
            }
        </>
    )
}