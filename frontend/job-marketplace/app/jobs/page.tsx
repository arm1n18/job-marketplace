'use client';

import { Container } from "@/components/Container";
import { JobCard, JobMainCard, SearchInput } from "@/components/shared";
import { Job } from "@/components/shared/Job/JobDetailsTypes";
import axios from "axios";
import { useEffect, useState } from "react";


export default function Jobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://192.168.0.106:8080/jobs");
                console.log("Fetched jobs:", response.data);
                setJobs(response.data);

                if(response.data.length > 0) {
                    setSelectedJob(response.data[0]);
                }
            } catch (err) {
                console.error("Error fetching jobs:", err)
            } finally {
                setLoading(false);
            }
        };
    
        fetchJobs();
    }, []);
    

    const handleClick = (job: Job) => {
        setSelectedJob(job);
    }

    
    return <>
        <Container className="mt-12">
            <SearchInput className="mb-12" />
            <div className="flex w-full">
                <div className="flex flex-col mr-5">
                {jobs.map(job => (
                        <JobCard
                            onClick={() => handleClick(job)}
                            key={job.id}
                            className={`mb-3 ${selectedJob === job ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200`}
                            image_url={job.image_url}
                            company_name={job.company_name}
                            title={job.title}
                            description={job.description}
                            salary_from={job.salary_from}
                            salary_to={job.salary_to}
                            keyInfo={[
                                job.city_name || "Україна",
                                job.employment_name,
                                job.subcategory_name || job.category_name,
                                job.experience
                                    ? `${job.experience.toString()} ${job.experience > 5 ? "років" : (job.experience > 1 ? "роки" : "рік")} досвіду`
                                    : "Без досвіду",
                            ]} id={job.id} experience={job.experience} category_name={job.category_name} employment_name={""} subcategory_name={""} city_name={""}
                        />
                    ))}
                </div>
                {selectedJob && (
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
                        city_name={selectedJob.city_name} />
                )}
            </div>
        </Container>
    </>;
}