import { Data } from "@/app/inbox/page";
import { Job, Resume } from "@/types";

interface Response {
    ID: number;
    status: string;
    selectedData: Resume | Job | null;
    setData: React.Dispatch<React.SetStateAction<Data | null>>;
    setSelectedData: React.Dispatch<React.SetStateAction<Resume | Job | null>>;
}

export const handleResponse = ({ ID, status, setData, setSelectedData, selectedData }: Response) => {
    setData((prevJobs: Data | null) =>{
        if(!prevJobs) return prevJobs;

        const updatedOffers = prevJobs.offers?.map((prevJob: Resume) => {
            if (prevJob.id === ID) {
                const updatedJob = { ...prevJob, status: { ...prevJob.status, String: status } };
                if(selectedData?.id === ID) setSelectedData(updatedJob);
                return updatedJob;
            }
            return prevJob;
        }) || [];
        
        return {
            applications: prevJobs.applications,
            offers: updatedOffers
        };
    });
};