'use client'

import { Job } from "@/types";
import { JobCard, JobMainCard } from "../Job";
import { JobCardSkeleton, JobMainCardSkeleton } from "../Skeletons";
import { NothingFound } from "../nothingFound";
import { useWindowWidth } from "@/components/hook/useWindowWidth";
import { useRouter } from "next/navigation";

interface ApplicationsProps {
    setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;
    selectedJob: Job | null;
    applications: Job[] | null;
    search: string;
    loading: boolean;
    className?: string
}

export const CandidateApplications: React.FC<ApplicationsProps> = ({ setSelectedJob, selectedJob, applications, loading, search, className }) => {
    const screenWidth = useWindowWidth();
    const router = useRouter();
    
    return (
        <div className="md:grid grid-cols-[32%,auto] w-full mt-12">
            <div className="flex flex-col md:mr-5">
                {loading ? (
                    Array.from({ length: 7 }).map((_, index) => (
                        <JobCardSkeleton key={index} className={`${index != 6 ? 'mb-5' : ''}`}/>
                    ))
                ) : (
                    
                    applications != null && applications.length > 0 && applications.map((application, index: number) => (
                        (application.company_name!.toLowerCase().includes(search.toLowerCase()) || application.title!.toLowerCase().includes(search.toLowerCase())) ? (
                            <JobCard
                            className={`${index != applications.length - 1 ? 'mb-3' : ''} ${selectedJob === application && screenWidth > 768 ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200`}
                            key={application.id}
                            onClick={() => {screenWidth > 768 ? setSelectedJob(application) : router.push(`/jobs/${application.id}`)}}
                            data={application}
                            keyInfo={[
                                application.city_name || "Україна",
                                application.employment_name ?? "",
                                application.experience
                                    ? `${application.experience.toString()} ${application.experience > 4 ? "років" : (application.experience > 1 ? "роки" : "рік")} досвіду`
                                    : "Без досвіду",
                                    application.subcategory_name ?? application.category_name ?? "",
                                        ]}
                                    />
                                    
                                ):<div className="absolute flex items-center justify-center left-0 right-0"><NothingFound type="notFound" /></div>) 
                            ) 
                        )}
            </div>
                {loading ? (
                    <JobMainCardSkeleton />
                ) : (
                    selectedJob && (
                        (selectedJob.company_name!.toLowerCase().includes(search.toLowerCase()) || selectedJob.title!.toLowerCase().includes(search.toLowerCase())) && (
                            <JobMainCard
                                className="h-screen overflow-auto scrollbar top-6 hidden md:block"
                                data={selectedJob}
                                onApplyClick={() => {}}
                                jobStatus={selectedJob.status.String}
                                keywords={[
                                { id: 1, name: 'Embedded' },
                                { id: 2, name: 'Linux' },
                                { id: 3, name: 'LinuxPostgreSQL' },
                                { id: 4, name: 'Windows Server' },
                                { id: 5, name: 'Python' },
                                { id: 6, name: 'Golang' },
                                ]}
                            />
                        )
                    )
                )}
        </div>
    );
};
