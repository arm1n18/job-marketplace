'use client';

import { Container } from "@/components/Container";
import { JobMainCard, SimilarJobs } from "@/components/shared";
import { Job } from "@/components/shared/Job/JobDetailsTypes";
import axios from "axios";
import { useEffect, useState } from "react";

export default function JobsDetailPage({ params: { id } }: { params: { id: number } }) {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`http://192.168.0.106:8080/jobs/${id}`);
                console.log("Fetched job:", response.data);
                setJob(response.data);
            } catch (err) {
                console.error("Error fetching jobs:", err)
            } finally {
                setLoading(false);
            }
        };
    
        fetchJobs();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!job) {
        return <div>No job found.</div>;
    }

    return (
        <Container>
            <JobMainCard
                className="mt-12"
                company_name={job.company_name}
                title={job.title}
                image_url={job.image_url}
                website={job.website}
                about_us={job.about_us}
                description={job.description}
                requirements={job.requirements}
                offer={job.offer}
                salary_from={job.salary_from}
                salary_to={job.salary_to}
                keywords={[{ id: 1, name: 'Embedded' },
                { id: 2, name: 'Linux' },
                { id: 3, name: 'LinuxPostgreSQL' },
                { id: 4, name: 'Windows Server' },
                { id: 5, name: 'Python' },
                { id: 6, name: 'Golang' },
                ]}
                experience={job.experience}
                category_name={job.category_name}
                employment_name={job.employment_name}
                subcategory_name={job.subcategory_name}
                city_name={job.city_name}
                />

            <SimilarJobs
                title={"System administrator"}
                company_name={"Atvaga Energy LLC"}
                city={"Одеса"}
                salary_from={2500}
                salary_to={1500}
                id={0}
                experience={0}
                category_name={""}
                employment_name={""}
                subcategory_name={""}
                city_name={""}
            />
        </Container>
    );
}