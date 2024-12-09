'use client';

import { Container } from "@/components/Container";
import { useQueryParams, useWindowWidth } from "@/components/hook";
import { SearchInput } from "@/components/shared";
import { filtersList } from "@/components/shared/filtersList";
import { FiltersSection } from "@/components/shared/FiltersSection";
import { JobCard, JobMainCard } from "@/components/shared/Job";
import { MobileFiltersSection } from "@/components/shared/MobileComponents/MobileFiltersSection";
import { NothingFound } from "@/components/shared/nothingFound";
import { JobCardSkeleton } from "@/components/shared/Skeletons/JobCardSkeleton";
import { JobMainCardSkeleton } from "@/components/shared/Skeletons/JobMainCardSkeleton";
import JobsService from "@/services/JobsService";
import { FiltersType } from "@/types/filters.type";
import { Job } from "@/types/job.type";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";


export default function Jobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams() as URLSearchParams
    const searchFilter = searchParams.get('search')
    const [filters, setFilters] = useState<FiltersType>(filtersList(searchParams));
    const screenWidth = useWindowWidth();

    const updateFilters = (updatedFilters: Partial<FiltersType>) => {
        setFilters((filters) => ({
            ...filters,
            ...updatedFilters,
        }));
    };

    const params = useQueryParams(searchFilter, filters);

    useEffect(() => {
        router.push(`?${params.toString()}`);
        const getJobs = new JobsService({url: "jobs/", params, setLoading, setData: setJobs, setSelectedData: setSelectedJob});
        getJobs.fetchJobs();
    }, [searchFilter, filters]);
    
    const handleSearch = async (query: string) => {
        if(query.trim() === "") router.push(`/jobs`);
        if( query.length < 2) return;
        router.push(`?search=${query}`);
    }
    
    const handleResponse = (jobID: number, status: string) => {
        setJobs((prevJobs) =>{
            const updatedJobs = prevJobs.map((prevJob) => {
                if (prevJob.id === jobID) {
                    const updatedJob = { ...prevJob, status: { ...prevJob.status, String: status } };
                    if(selectedJob?.id === jobID) setSelectedJob(updatedJob);
                    return updatedJob;
                }
                return prevJob;
            })
            
            return updatedJobs;
        });
    };
    

    return <>
        <div className="mx-4 mb-24">
        
        <Container className="mt-12 relative">
            <SearchInput
                onSearch={handleSearch}
            />
            <FiltersSection onUpdateFilters={updateFilters} className="my-12"/>
            {!loading && jobs.length === 0 && 
                <NothingFound type={"notFound"} />
            }
            <div className="md:grid grid-cols-[32%,auto] w-full max-md:mt-12">
                <div className="flex flex-col md:mr-5">
                    {loading ? (
                         Array.from({ length: 7 }).map((_, index) => (
                            <JobCardSkeleton key={index} className={`${index != 6 ? 'mb-3' : ''}`}/>
                        ))
                    ) : (
                        jobs != null && jobs.length > 0 && jobs.map((job, index: number) => (

                                <JobCard
                                    className={`${index != jobs.length - 1 ? 'mb-3' : ''} ${selectedJob === job && screenWidth > 768 ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200`}
                                    key={job.id}
                                    onClick={() => {screenWidth > 768 ? setSelectedJob(job) : router.push(`/jobs/${job.id}`)}}
                                    data={job}
                                    keyInfo={[
                                        job.city_name || "Україна",
                                        job.employment_name ?? "",
                                        job.experience
                                            ? `${job.experience.toString()} ${job.experience > 4 ? "років" : (job.experience > 1 ? "роки" : "рік")} досвіду`
                                            : "Без досвіду",
                                        job.subcategory_name ?? job.category_name ?? "",
                                    ]}/>
      
                            ))
                    )}
                   <MobileFiltersSection onUpdateFilters={updateFilters}/>
                </div>
                {loading ? (
                    <JobMainCardSkeleton />
                ) : (
                    jobs != null && jobs.length > 0 && selectedJob && (
                        <JobMainCard
                            className="h-screen overflow-auto scrollbar top-6 hidden md:block"
                            data={selectedJob}
                            isMainPage={false}
                            onApplyClick={handleResponse}
                            jobStatus={selectedJob.status.String}
                            route={selectedJob.application_id ? `offer` : `application`}
                            responseID={selectedJob.application_id ? selectedJob.application_id : selectedJob.offer_id}
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
                )}
            </div>
        </Container>
        </div>
    </>;
}
