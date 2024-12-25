import { useWindowWidth } from "@/components/hook/useWindowWidth";
import { Resume } from "@/types";
import { useRouter } from "next/navigation";
import { ResumeCardSkeleton, ResumeMainCardSkeleton } from "../Skeletons";
import { ResumeCard, ResumeMainCard } from "../Candidate";
import React from "react";

interface ApplicationsProps {
    setSelectedResume: React.Dispatch<React.SetStateAction<Resume | null>>;
    selectedResume: Resume | null;
    applications: Resume[] | null;
    search: string;
    loading: boolean;
    className?: string
}

export const RecruiterApplications: React.FC<ApplicationsProps> = ({ setSelectedResume, selectedResume, applications, loading, search }) => {
    const screenWidth = useWindowWidth();
    const router = useRouter();

    const offerOrApplication = selectedResume && (selectedResume.offerID != 0 ? "application" : "offer");
    const responseID = selectedResume && (selectedResume.offerID != 0 ? selectedResume.offerID : selectedResume.applicationID);
    
    return (
        <div className="md:grid grid-cols-[37%,auto] w-full mt-12">
            <div className="flex flex-col md:mr-5">
            {loading ? (
                Array.from({ length: 5}).map((_, index) => (
                    <ResumeCardSkeleton key={index} className={`${index != 4 ? 'mb-5' : ''}`}/>
                ))
            ) : (
                applications != null && applications.length > 0 && applications.map((application, index: number) => (
                    (application.jobTitle!.toLowerCase().includes(search.toLowerCase()) || application.category_name!.toLowerCase().includes(search.toLowerCase())) && (
                    <ResumeCard
                        key={index}
                        className={`${index != applications.length - 1 ? 'mb-3' : ''} ${selectedResume === application && screenWidth > 768 ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200`}
                        data={application}
                        onClick={() => {
                            if (screenWidth > 768) {
                                setSelectedResume(application);
                            } else {
                                router.push(`/response/candidate/${selectedResume && selectedResume.id}?${offerOrApplication}=${responseID}`)
                            }
                        }}
                        />
                    )
                    ))
                )}
            </div>
            {loading ? (
                <ResumeMainCardSkeleton className="h-screen overflow-auto scrollbar top-6"/>
            ):(
                applications != null && applications.length > 0 && selectedResume && (
                (selectedResume.jobTitle!.toLowerCase().includes(search.toLowerCase()) || selectedResume.category_name!.toLowerCase().includes(search.toLowerCase())) && (
                    <ResumeMainCard
                        className="h-screen overflow-auto scrollbar top-6 hidden md:block"
                        data={selectedResume}
                        onApplyClick={() => {}}
                        resumeStatus={selectedResume.status.String}
                        route="application"
                        responseID={selectedResume.applicationID}
                    />
                )
            ))}
        </div>
    )
}