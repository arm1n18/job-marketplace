import { Data } from "@/app/inbox/page";
import { Resume } from "@/types";
import { ResumeCardSkeleton, ResumeMainCardSkeleton } from "../Skeletons";
import { ResumeCard, ResumeMainCard } from "../Candidate";
import { useWindowWidth } from "@/components/hook/useWindowWidth";
import { useRouter } from "next/navigation";
import { handleResponse } from "@/lib/utils/handleResponse";

interface OffersProps {
    setData: React.Dispatch<React.SetStateAction<Data | null>>;
    setSelectedResume: React.Dispatch<React.SetStateAction<Resume | null>>;
    selectedResume: Resume | null;
    offers: Resume[] | null;
    search: string;
    loading: boolean;
    className?: string
}

export const RecruiterOffers: React.FC<OffersProps> = ({ setSelectedResume, selectedResume, offers, loading, search, setData }) => {
    const screenWidth = useWindowWidth();
    const router = useRouter();

    const offerOrApplication = selectedResume && (selectedResume.offerID != 0 ? "application" : "offer");
    const responseID = selectedResume && (selectedResume.offerID != 0 ? selectedResume.offerID : selectedResume.applicationID);

    const handleResponseClick = (jobID: number, status: string) => {
        const responseParams = { ID: jobID, status, setData, setSelectedData: setSelectedResume, selectedData: selectedResume };
        handleResponse(responseParams);
    }
    
    return (
        <div className="md:grid grid-cols-[37%,auto] w-full mt-12">
            <div className="flex flex-col md:mr-5">
            {loading ? (
                Array.from({ length: 5}).map((_, index) => (
                    <ResumeCardSkeleton key={index} className={`${index != 4 ? 'mb-5' : ''}`}/>
                ))
            ) : (
                offers != null && offers.length > 0 && offers.map((offer, index: number) => (
                    (offer.jobTitle!.toLowerCase().includes(search.toLowerCase()) || offer.category_name!.toLowerCase().includes(search.toLowerCase())) && (
                    <ResumeCard
                        key={index}
                        className={`${index != offers.length - 1 ? 'mb-3' : ''} ${selectedResume === offer && screenWidth > 768 ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200`}
                        data={offer}
                        onClick={() => {
                            if (screenWidth > 768) {
                                setSelectedResume(offer);
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
                offers != null && offers.length > 0 && selectedResume && (
                    (selectedResume.jobTitle!.toLowerCase().includes(search.toLowerCase()) || selectedResume.category_name!.toLowerCase().includes(search.toLowerCase())) && (
                        <ResumeMainCard
                            className="h-screen overflow-auto scrollbar top-6 hidden md:block"
                            data={selectedResume}
                            onApplyClick={handleResponseClick}
                            resumeStatus={selectedResume.status.String}
                            route="offer"
                            responseID={selectedResume.offerID}
                        />
                    )
            ))}
        </div>
    )
}