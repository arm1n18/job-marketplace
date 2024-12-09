'use client'

import { Job } from "@/types";
import { JobCard, JobMainCard } from "../Job";
import { JobCardSkeleton, JobMainCardSkeleton } from "../Skeletons";
import { Data } from "@/app/inbox/page";
import { useWindowWidth } from "@/components/hook/useWindowWidth";
import { useRouter } from "next/navigation";

interface OffersProps {
    setData: React.Dispatch<React.SetStateAction<Data | null>>;
    data: Data | null;
    setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;
    selectedJob: Job | null;
    applications: Job[] | null;
    search: string;
    loading: boolean;
    className?: string
}

export const CandidateOffers: React.FC<OffersProps> = ({ setSelectedJob, selectedJob, applications, loading, search, setData, data }) => {
    const screenWidth = useWindowWidth();
    const router = useRouter();
    
    const handleResponse = (jobID: number, status: string) => {
        setData((prevJobs: Data | null) =>{
            if(!prevJobs) return prevJobs;

            const updatedOffers = prevJobs.offers?.map((prevJob: Job) => {
                if (prevJob.id === jobID) {
                    const updatedJob = { ...prevJob, status: { ...prevJob.status, String: status } };
                    if(selectedJob?.id === jobID) setSelectedJob(updatedJob);
                    return updatedJob;
                }
                return prevJob;
            }) || [];
            
            return {
                applications: prevJobs.applications,
                offers: updatedOffers
            };
        });
    };

    return (
        <div className="md:grid grid-cols-[32%,auto] w-full mt-12">
            <div className="flex flex-col md:mr-5">
                {loading ? (
                    Array.from({ length: 7 }).map((_, index) => (
                        <JobCardSkeleton key={index} className={`${index != 6 ? 'mb-5' : ''}`}/>
                    ))
                ) : (
                    applications != null && applications.length > 0 && applications.map((application, index: number) => (
                        (application.company_name!.toLowerCase().includes(search.toLowerCase()) || application.title!.toLowerCase().includes(search.toLowerCase())) && (
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
                                    )
                                ))
                            )}
                        </div>
                {loading ? (
                    <JobMainCardSkeleton />
                ) : (
                    applications != null && applications.length > 0 && selectedJob && (
                        (selectedJob.company_name!.toLowerCase().includes(search.toLowerCase()) || selectedJob.title!.toLowerCase().includes(search.toLowerCase())) && (
                            <JobMainCard
                                className="h-screen overflow-auto scrollbar top-6 hidden md:block"
                                data={selectedJob}
                                onApplyClick={handleResponse}
                                jobStatus={selectedJob.status.String}
                                responseID={selectedJob.offer_id}
                                route="offer"
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
}