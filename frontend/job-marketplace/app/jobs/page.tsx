'use client';

import { Container } from "@/components/Container";
import { fetchData } from "@/components/hook/fetchData";
import { useQueryParams } from "@/components/hook/useQueryParams";
import { FiltersSection, JobCard, JobMainCard, SearchInput } from "@/components/shared";
import { filtersList } from "@/components/shared/filtersList";
import { Job } from "@/components/shared/Job/JobDetailsTypes";
import { JobCardSkeleton } from "@/components/shared/Skeletons/JobCardSkeleton";
import { JobMainCardSkeleton } from "@/components/shared/Skeletons/JobMainCardSkeleton";
import { FiltersType } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Jobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams() as URLSearchParams
    const searchFilter = searchParams.get('search')

    const [filters, setFilters] = useState<FiltersType>(filtersList(searchParams));

    const updateFilters = (updatedFilters: Partial<FiltersType>) => {
        setFilters((filters) => ({
            ...filters,
            ...updatedFilters,
        }));
    };

    const params = useQueryParams(searchFilter, filters);

    useEffect(() => {
        router.push(`?${params.toString()}`);
        fetchData({url: "jobs", params, setLoading, setData: setJobs, setSelectedData: setSelectedJob});
    }, [searchFilter, filters]);
    
    const handleSearch = async (query: string) => {
        if(query.trim() === "") router.push(`/jobs`);
        if( query.length < 2) return;
        router.push(`?search=${query}`);
    }
    
    const handleClick = (job: Job) => {
        setSelectedJob(job);
    }
    
    
    return <>
        <div className="mx-2">
        <Container className="mt-12">
            <SearchInput
                onSearch={handleSearch}
            />
            <FiltersSection onUpdateFilters={updateFilters} className="my-12"/>
            <div className="flex w-full">
                <div className="flex flex-col mr-5">
                    {loading ? (
                         Array.from({ length: 5 }).map((_, index) => (
                            <JobCardSkeleton key={index}/>
                        ))
                    ) : (
                        jobs != null && jobs.length > 0 && jobs.map(job => (
                                <JobCard
                                    onClick={() => handleClick(job)}
                                    key={job.id}
                                    id={job.id}
                                    className={`mb-3 ${selectedJob === job ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200`}
                                    image_url={job.image_url}
                                    company_name={job.company_name}
                                    title={job.title}
                                    description={job.description}
                                    salary_from={job.salary_from}
                                    salary_to={job.salary_to}
                                    created_at = {job.created_at}
                                    keyInfo={[
                                        job.city_name || "Україна",
                                        job.employment_name,
                                        job.subcategory_name || job.category_name,
                                        job.experience
                                            ? `${job.experience.toString()} ${job.experience > 4 ? "років" : (job.experience > 1 ? "роки" : "рік")} досвіду`
                                            : "Без досвіду",
                                    ]}experience={job.experience} category_name={job.category_name} employment_name={""} subcategory_name={""} city_name={""}
                                />
                            ))
                    )}
                </div>
                {loading ? (
                    <JobMainCardSkeleton />
                ) : (
                    jobs != null && jobs.length > 0 && selectedJob && (
                        <JobMainCard
                            className="h-screen overflow-auto scrollbar top-6"
                            company_name={selectedJob.company_name}
                            title={selectedJob.title}
                            image_url={selectedJob.image_url}
                            description={selectedJob.description}
                            requirements={selectedJob.requirements}
                            offer={selectedJob.offer}
                            salary_from={selectedJob.salary_from}
                            salary_to={selectedJob.salary_to}
                            keywords={[{ id: 1, name: 'Embedded' },
                            { id: 2, name: 'Linux' },
                            { id: 3, name: 'LinuxPostgreSQL' },
                            { id: 4, name: 'Windows Server' },
                            { id: 5, name: 'Python' },
                            { id: 6, name: 'Golang' },
                            ]}
                            about_us={selectedJob.about_us}
                            website={selectedJob.website}
                            experience={selectedJob.experience}
                            category_name={selectedJob.category_name}
                            employment_name={selectedJob.employment_name}
                            subcategory_name={selectedJob.subcategory_name}
                            city_name={selectedJob.city_name}
                            created_at={selectedJob.created_at}
                        />
                    )
                )}
            </div>
        </Container>
        </div>
    </>;
}

function fetchInfo(arg0: { url: string; params: URLSearchParams; setLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>; setData: import("react").Dispatch<import("react").SetStateAction<Job[]>>; setSelectedData: import("react").Dispatch<import("react").SetStateAction<Job | null>>; }) {
    throw new Error("Function not implemented.");
}
