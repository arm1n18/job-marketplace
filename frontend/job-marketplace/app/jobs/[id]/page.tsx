'use client';

import { Container } from "@/components/Container";
import { JobMainCard, SimilarJobs } from "@/components/shared";
import { NothingFound } from "@/components/shared/nothingFound";
import { JobMainCardSkeleton } from "@/components/shared/Skeletons";
import FetchDataService from "@/services/FetchDataService";
import { Job } from "@/types";
import { useEffect, useState } from "react";

export default function JobsDetailPage({ params: { id } }: { params: { id: number } }) {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // const fetchJob = async () => {
        //     try {
        //         const response = await axios.get(`http://192.168.0.106:8080/jobs/${id}`);
        //         console.log("Fetched job:", response.data);
        //         setJob(response.data);
        //     } catch (err) {
        //         console.error("Error fetching job:", err)
        //     } finally {
        //         setLoading(false);
        //     }
        // };
    
        // fetchJob();
        const getJobs = new FetchDataService({url: `jobs/${id}`, setLoading, setData: setJob});
        getJobs.getData();
    }, [id]);

    if (loading) {
            return (
                <div className="max-md:mx-1 mx-4">
                    <Container>
                        <JobMainCardSkeleton className="my-12"/>
                    </Container>
                </div>
            );
        }

    if (!job) {
        return <><NothingFound type={"noJob"} /></>;
    }

    const handleResponse = (jobID: number, status: string) => {
        setJob((prevJob) =>{
            if (prevJob!.id === jobID) {
                const updatedJob = { ...prevJob, status: { ...prevJob!.status, String: status } };
                return updatedJob;
            }
            return prevJob;
        });
    };

    return (
        <div className="max-md:mx-1 mx-4 mb-24">
            <Container>
            <JobMainCard
                className="mt-12"
                data={job}
                keywords={[{ id: 1, name: 'Embedded' },
                { id: 2, name: 'Linux' },
                { id: 3, name: 'LinuxPostgreSQL' },
                { id: 4, name: 'Windows Server' },
                { id: 5, name: 'Python' },
                { id: 6, name: 'Golang' },
                ]}
                onApplyClick={handleResponse}
                jobStatus={job.status.String}
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
        </div>
    );
}