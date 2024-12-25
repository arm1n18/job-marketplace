'use client';

import { Container } from "@/components/Container";
import { JobMainCard, SimilarJobs } from "@/components/shared";
import { NothingFound } from "@/components/shared/nothingFound";
import { JobMainCardSkeleton } from "@/components/shared/Skeletons";
import JobsService from "@/services/JobsService";
import { Job } from "@/types";
import { useEffect, useState } from "react";

export default function JobsDetailPage({ params: { id } }: { params: { id: number } }) {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const getJobByID = new JobsService({url: `jobs/${id}`, setLoading, setData: setJob});
        getJobByID.fetchJobByID();
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
        return <NothingFound type={"noJob"} />;
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
                route={job.application_id ? `offer` : `application`}
                responseID={job.application_id ? job.application_id : job.offer_id}
                isMainPage={true}
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