'use client';

import { Container } from "@/components/Container";
import { useQueryParams, useWindowWidth } from "@/components/hook";
import { filtersList } from "@/components/shared/filtersList";
import { JobCard, JobMainCard, SearchInput } from "@/components/shared";
import { FiltersSection } from "@/components/shared/FiltersSection";
import { NothingFound } from "@/components/shared/nothingFound";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CompanyCard } from "@/components/shared/Company/CompanyCard";
import { MobileFiltersSection } from "@/components/shared/MobileComponents/MobileFiltersSection";
import { CompanyCardSkeleton, JobCardSkeleton, JobMainCardSkeleton, Skeleton } from "@/components/shared/Skeletons";
import { Company, FiltersType, Job } from "@/types";
import CompanyService from "@/services/CompanyService";

export default function CompanyPage({ params: { id } }: { params: { id: string } }) {
    const searchParams = useSearchParams() as URLSearchParams
    const [filters, setFilters] = useState<FiltersType>(filtersList(searchParams));
    const [company, setCompany] = useState<Company | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [companyJobs, setCompanyJobs] = useState<Job[] | null>([]);
    const searchFilter = searchParams.get('search')
    const [loading, setLoading] = useState(true);
    const screenWidth = useWindowWidth();
    const router = useRouter();
    
    
    const updateFilters = (updatedFilters: Partial<FiltersType>) => {
        setFilters((filters) => ({
            ...filters,
            ...updatedFilters,
        }));
    };
    
    const params = useQueryParams(searchFilter, filters);

    useEffect(() => {
        const company = new CompanyService({ id: id, params: params, setLoading: setLoading, setCompany: setCompany,
            setCompanyJobs: setCompanyJobs, setSelectedJob: setSelectedJob});
        company.fetchCompanyInfo();
    }, [id, searchFilter, filters]);

    const handleSearch = async (query: string) => {
        if(query.trim() === "" || query.length < 2) return;
        router.push(`/company/${id}/?search=${query}`);
    }

    const handleResponse = (jobID: number, status: string) => {
        setCompanyJobs((prevJobs) => {
            if (!prevJobs) return prevJobs;
            const updatedJobs = prevJobs
                .map((prevJob) => {
                    if (prevJob.id === jobID) {
                    const updatedJob = { ...prevJob, status: { ...prevJob.status, String: status } };
                    if (selectedJob?.id === jobID) setSelectedJob(updatedJob);
                    return updatedJob;
                    }
                    return prevJob;
                }) as Job[];
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
                <p className="text-title-dark">Вакансії компанії {company.company_name}  <span className="text-title-bg">{companyJobs ? companyJobs?.length : 0}</span></p>
            </div>
            
            <SearchInput onSearch={handleSearch} />
            <FiltersSection onUpdateFilters={updateFilters} className="my-12"/>
            
            {!loading && !companyJobs && 
                <NothingFound type={"notFound"} />
            }
            <div className="md:grid grid-cols-[32%,auto] w-full max-md:mt-12">
                <div className="flex flex-col md:mr-5">
                    {loading ? (
                         Array.from({ length: 7 }).map((_, index) => (
                            <JobCardSkeleton key={index} className={`${index != 6 ? 'mb-5' : ''}`}/>
                        ))
                    ) : (
                        companyJobs != null && companyJobs.length > 0 && companyJobs.map((companyJob, index: number) => (

                                <JobCard
                                    className={`${index != companyJobs.length - 1 ? 'mb-3' : ''} ${selectedJob === companyJob && screenWidth > 768 ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200`}
                                    key={companyJob.id}
                                    onClick={() => {screenWidth > 768 ? setSelectedJob(companyJob) : router.push(`/jobs/${companyJob.id}`)}}
                                    data={companyJob}
                                    keyInfo={[
                                        companyJob.city || "Україна",
                                        companyJob.employment_name ?? "",
                                        companyJob.experience
                                            ? `${companyJob.experience.toString()} ${companyJob.experience > 4 ? "років" : (companyJob.experience > 1 ? "роки" : "рік")} досвіду`
                                            : "Без досвіду",
                                        companyJob.subcategory_name ?? companyJob.category_name ?? "",
                                    ]}/>
      
                            ))
                    )}
                   <MobileFiltersSection onUpdateFilters={updateFilters}/>
                </div>
                {loading ? (
                    <JobMainCardSkeleton />
                ) : (
                    companyJobs != null && companyJobs.length > 0 && selectedJob && (
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