'use client';

import { Container } from "@/components/Container";
import { FiltersSection, SearchInput } from "@/components/shared";
import { ResumeMainCard } from "@/components/shared/Candidate/ResumeMainCard";
import { ResumeCard } from "@/components/shared/Candidate/ResumeCard";
import { Resume } from "@/components/shared/Candidate/ResumeDetailsTypes";
import axios from "axios";
import { useEffect, useState } from "react";
import { ResumeCardSkeleton } from "@/components/shared/Skeletons/ResumeCardSkeleton";
import { ResumeMainCardSkeleton } from "@/components/shared/Skeletons/ResumeMainCardSkeleton";
import { useRouter, useSearchParams } from "next/navigation";


export default function Candidates() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const searchParams = useSearchParams()
    const searchFilter = searchParams.get('search')

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const params = new URLSearchParams();
                if (searchFilter) params.append('search', searchFilter);

                const response = await axios.get(`http://192.168.0.106:8080/candidates?${params.toString()}`);
                console.log("Fetched candidates:", response.data);
                setResumes(response.data);

                if(response.data.length > 0) {
                    setSelectedResume(response.data[0]);
                }
            } catch (err) {
                console.error("Error fetching jobs:", err)
            } finally {
                setLoading(false);
            }
        };

        
        fetchCandidates();
    }, [searchFilter]);


    const handleClick = (resume: Resume) => {
        setSelectedResume(resume);
    }

    const handleSearch = async (query: string) => {
        if(query.trim() === "" || query.length < 2) return;
        router.push(`/candidates/?search=${query}`);
    }

    return (
        <>
            <Container className="mt-12">
                <SearchInput
                    onSearch={handleSearch}
                    className="mb-12"
                />
                <FiltersSection
                    className="my-12" />
                <div className="flex w-full">
                    <div className="flex flex-col mr-5">
                    {loading ? (
                        Array.from({ length: 5}).map((_, index) => (
                            <ResumeCardSkeleton key={index} />
                        ))
                    ) : (
                        resumes != null && resumes.map(resume => (
                            <ResumeCard
                                key={resume.id}
                                id={resume.id}
                                className={`mb-3 ${selectedResume === resume ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200`}
                                onClick={() => handleClick(resume)}
                                title={resume.title}
                                work_experience={resume.work_experience}
                                category_name={resume.category_name}
                                subcategory_name={resume.subcategory_name}
                                salary={resume.salary}
                                city_name={resume.city_name}
                                experience={resume.experience}
                                achievements={resume.achievements}
                                employment_name={resume.employment_name}
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
                        )))}
                    </div>
                    {loading ? (
                        <ResumeMainCardSkeleton className="h-screen overflow-auto scrollbar top-6"/>
                    ):(
                        resumes != null && selectedResume && (
                    <ResumeMainCard
                        className="h-screen overflow-auto scrollbar top-6"
                        title={selectedResume.title}
                        work_experience={selectedResume.work_experience}
                        achievements={selectedResume.achievements}
                        salary={selectedResume.salary}
                        keywords={[{ id: 1, name: 'Embedded' },
                        { id: 2, name: 'Linux' },
                        { id: 3, name: 'LinuxPostgreSQL' },
                        { id: 4, name: 'Windows Server' },
                        { id: 5, name: 'Python' },
                        { id: 6, name: 'Golang' },
                        ]}
                        experience={selectedResume.experience}
                        category_name={selectedResume.category_name}
                        employment_name={selectedResume.employment_name}
                        subcategory_name={selectedResume.subcategory_name}
                        city_name={selectedResume.city_name} />
                    ))}
                </div>
            </Container>
        </>
    )
}