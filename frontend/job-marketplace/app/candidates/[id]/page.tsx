'use client';

import { Container } from "@/components/Container";
import { NothingFound } from "@/components/shared/nothingFound";
import { useEffect, useState } from "react";
import { Resume } from "@/types";
import { ResumeMainCardSkeleton } from "@/components/shared/Skeletons";
import { ResumeMainCard } from "@/components/shared/Candidate";
import FetchDataService from "@/services/FetchDataService";

export default function CandidatesDetailPage({ params: { id } }: { params: { id: number } }) {
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const getResumeByID = new FetchDataService({url: `candidates/${id}`, setLoading, setData: setResume});
        getResumeByID.getData();
    }, [id]);


    if (loading) {
        return (
            <div className="max-md:mx-1 mx-2">
                <Container>
                    <ResumeMainCardSkeleton isMainPage={true} className="my-12"/>
                </Container>
            </div>
        );
    }

    if(!resume) {
        return <><NothingFound type={"noResume"} /></>;
    }

    const handleResponse = (resumeID: number) => {
        setResume((prevResume) => {
            if (prevResume!.id === resumeID) {
            const updatedResume: Resume = { ...prevResume, status: { ...prevResume!.status, String: "OFFER_PENDING" } };
            return updatedResume;
            }
            return prevResume;
        });
    };

    return (
        <div className="max-md:mx-1 mx-2 mb-24">
            <Container>
            <ResumeMainCard
                className="mt-12"
                data={resume}
                onApplyClick={() => handleResponse(resume.id!)}
                resumeStatus={resume.status.String}
                isMainPage={true}
            />
        </Container>
        </div>
    );
}