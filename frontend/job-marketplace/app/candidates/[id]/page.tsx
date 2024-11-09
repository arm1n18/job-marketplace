'use client';

import { Container } from "@/components/Container";
import { Resume } from "@/components/shared/Candidate/ResumeDetailsTypes";
import { ResumeMainCard } from "@/components/shared/Candidate/ResumeMainCard";
import { ResumeMainCardSkeleton } from "@/components/shared/Skeletons/ResumeMainCardSkeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

export default function CandidatesDetailPage({ params: { id } }: { params: { id: number } }) {
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await axios.get(`http://192.168.0.106:8080/candidates/${id}`);
                console.log("Fetched resume:", response.data);
                setResume(response.data);
            } catch (err) {
                console.log("Error fetching resume:", err)
            } finally {
                setLoading(false);
            }

        };
        fetchResume();
    }, [id]);


    if (loading) {
        return (
            <Container>
                <ResumeMainCardSkeleton isMainPage={true} className="my-12"/>
            </Container>
        );
    }

    if(!resume) {
        return <div>No resume found.</div>
    }

    return (
        <div className="mx-2">
            <Container>
            <ResumeMainCard
                className="mt-12"
                title={resume.title}
                work_experience={resume.work_experience}
                achievements={resume.achievements}
                salary={resume.salary}
                keywords={[{ id: 1, name: 'Embedded' },
                { id: 2, name: 'Linux' },
                { id: 3, name: 'LinuxPostgreSQL' },
                { id: 4, name: 'Windows Server' },
                { id: 5, name: 'Python' },
                { id: 6, name: 'Golang' },
                ]}
                experience={resume.experience}
                category_name={resume.category_name}
                employment_name={resume.employment_name}
                subcategory_name={resume.subcategory_name}
                city_name={resume.city_name}
                isMainPage={true}/>
        </Container>
        </div>
    );
}