'use client';

import { Container } from "@/components/Container";
import { useQueryParams } from "@/components/hook/useQueryParams";
import { filtersList } from "@/components/shared/filtersList";
import { FiltersSection } from "@/components/shared/FiltersSection";
import { NothingFound } from "@/components/shared/nothingFound";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CompanyCard } from "@/components/shared/Company/CompanyCard";
import { JobCard, JobMainCard, SearchInput } from "@/components/shared";
import { MobileFiltersSection } from "@/components/shared/MobileComponents/MobileFiltersSection";
import { CompanyCardSkeleton, JobCardSkeleton, JobMainCardSkeleton, Skeleton } from "@/components/shared/Skeletons";
import { Company, FiltersType, Job } from "@/types";
import { useWindowWidth } from "@/components/hook/useWindowWidth";
import JWTService from "@/services/JWTService";

export default function CompanyPage({ params: { id } }: { params: { id: string } }) {
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[] | null>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const screenWidth = useWindowWidth();
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
    const jwtService = new JWTService();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                router.push(`?${params.toString()}`);
                const response = await axios.get(`http://192.168.0.106:8080/company/${id}?${params.toString()}`, {
                    headers: {
                        Authorization: jwtService.getAccessToken() ? `Bearer ${jwtService.getAccessToken()}` : undefined,
                    }, 
                });
                setCompany(response.data.company);
                setJobs(response.data.jobs);

                if(response.data.jobs.length > 0) {
                    setSelectedJob(response.data.jobs[0]);
                }
            } catch (err) {
                console.error("Error fetching jobs:", err)
            } finally {
                setLoading(false);
            }
        };
    
        fetchJobs();
    }, [id, searchFilter, filters]);

    const handleSearch = async (query: string) => {
        if(query.trim() === "" || query.length < 2) return;
        router.push(`/company/${id}/?search=${query}`);
    }

    const handleResponse = (jobID: number, status: string) => {
        setJobs((prevJobs) =>{
            if (!prevJobs) return prevJobs;
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


    if (loading) {
        return (
            <div className="mx-4 mb-48">
                <Container>
                    <CompanyCardSkeleton className="my-12"/>
                    <Skeleton className="w-1/4 h-9 mb-12"/>
                    <SearchInput
                        onSearch={() => {}}
                    />
                    <FiltersSection onUpdateFilters={updateFilters} className="my-12"/>
                    <div className="md:grid grid-cols-[32%,auto] w-full max-md:mt-12">
                        <div className="flex flex-col md:mr-5">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <JobCardSkeleton key={index} />
                            ))}
                        </div>
                        <JobMainCardSkeleton />
                    </div>
                </Container>
            </div>
            
        );
    }

    if (!company) {
        return <><NothingFound type={"noCompany"} /></>;
    }

    return <>
        <div className="mx-4 mb-24">
        <Container >
            <CompanyCard
                className="my-12"
                company_name={company.company_name}
                about_us={company.about_us}
                image_url={company.image_url}
                website={company.website}
                linkedin={company.linkedin}
                facebook={company.facebook} />
            
            <div className="mb-12 flex">
                <p className="text-title-dark">Вакансії компанії {company.company_name}  <span className="text-title-bg">{jobs ? jobs?.length : 0}</span></p>
            </div>
            
            <SearchInput onSearch={handleSearch} />
            <FiltersSection onUpdateFilters={updateFilters} className="my-12"/>
            
            {!loading && !jobs && 
                <NothingFound type={"notFound"} />
            }
            <div className="md:grid grid-cols-[32%,auto] w-full max-md:mt-12">
                <div className="flex flex-col md:mr-5">
                    {loading ? (
                         Array.from({ length: 7 }).map((_, index) => (
                            <JobCardSkeleton key={index} className={`${index != 6 ? 'mb-5' : ''}`}/>
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
                            onApplyClick={handleResponse}
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
                )}
            </div>
        </Container>
        </div>
    </>
}