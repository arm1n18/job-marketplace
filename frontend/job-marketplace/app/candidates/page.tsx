'use client';

import { Container } from "@/components/Container";
import { SearchInput } from "@/components/shared";
import { ResumeMainCard, ResumeCard } from "@/components/shared/Candidate";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryParams, useWindowWidth } from "@/components/hook";
import { filtersList } from "@/components/shared/filtersList";
import { MobileFiltersSection } from "@/components/shared/MobileComponents/MobileFiltersSection";
import { ResumeCardSkeleton, ResumeMainCardSkeleton } from "@/components/shared/Skeletons";
import { NothingFound } from "@/components/shared/nothingFound";
import { FiltersSection } from "@/components/shared/FiltersSection";
import fetchGroupDataService from "@/services/FetchDataService";
import { FiltersType, Resume } from "@/types";

export default function Candidates() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const screenWidth = useWindowWidth();
    const router = useRouter();
    const searchParams = useSearchParams()
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
        const getCandidates = new fetchGroupDataService({url: "candidates/", params, setLoading, setData: setResumes, setSelectedData: setSelectedResume});
        getCandidates.getData();
    }, [searchFilter, filters]);

    const handleSearch = async (query: string) => {
        if(query.trim() === "") router.push(`/candidates`);
        if( query.length < 2) return;
        router.push(`?search=${query}`);
    }

    const handleResponse = (resumeID: number, status: string) => {

        setResumes((prevResumes) =>{
            const updatedResumes = prevResumes.map((prevResume) => {
                if (prevResume.id === resumeID) {
                    const updatedResume = { ...prevResume, status: { ...prevResume.status, String: status } };
                    if(selectedResume?.id === resumeID) setSelectedResume(updatedResume);
                    return updatedResume;
                }
                return prevResume;
            })
            
            return updatedResumes;
        });

    };

    return (
        <>
            <div className="mx-4 mb-24">
            <Container className="mt-12">
                <SearchInput
                    onSearch={handleSearch}
                />
                <FiltersSection onUpdateFilters={updateFilters} className="my-12"/>
                {!loading && resumes.length === 0 && 
                    <NothingFound type={"notFound"} />
                }
                <div className="md:grid grid-cols-[37%,auto] w-full max-md:mt-12">
                    <div className="flex flex-col md:mr-5">
                    {loading ? (
                        Array.from({ length: 5}).map((_, index) => (
                            <ResumeCardSkeleton key={index} className={`${index != 4 ? 'mb-5' : ''}`}/>
                        ))
                    ) : (
                        resumes != null && resumes.length > 0 && resumes.map((resume, index: number) => (
                            <React.Fragment key={resume.id}> 
                                <ResumeCard
                                    key={resume.id}
                                    className={`${index != resumes.length - 1 ? 'mb-3' : ''} ${selectedResume === resume && screenWidth > 768 ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200`}
                                    data={resume}
                                    onClick={() => setSelectedResume(resume)}
                                    keywords={[{ id: 1, name: 'statistics' },
                                        { id: 2, name: 'Data Science' },
                                        { id: 3, name: 'Keras' },
                                        { id: 4, name: 'PyTorchr' },
                                        { id: 5, name: 'Python' },
                                        { id: 7, name: 'Goscikit-learnlang' },
                                        { id: 8, name: 'Pandas' },
                                        { id: 9, name: 'math' },
                                        { id: 10, name: 'matplotlib' },
                                        { id: 11, name: 'numpy' },
                                        { id: 12, name: 'NLP' },
                                        ]}
                                    />
                                </React.Fragment>
                            ))
                        )}
                        <MobileFiltersSection onUpdateFilters={updateFilters}/>
                    </div>
                    {loading ? (
                        <ResumeMainCardSkeleton className="h-screen overflow-auto scrollbar top-6"/>
                    ):(
                        resumes != null && resumes.length > 0 && selectedResume && (
                    <ResumeMainCard
                        className="h-screen overflow-auto scrollbar top-6 hidden md:block"
                        data={selectedResume}
                        onApplyClick={handleResponse}
                        resumeStatus={selectedResume.status.String}
                        keywords={[{ id: 1, name: 'Embedded' },
                        { id: 2, name: 'Linux' },
                        { id: 3, name: 'LinuxPostgreSQL' },
                        { id: 4, name: 'Windows Server' },
                        { id: 5, name: 'Python' },
                        { id: 6, name: 'Golang' },
                        ]}
                        />
                    ))}
                </div>
            </Container>
            </div>
        </>
    )
}