import { CompanyProfile, CandidateProfile } from "@/components/shared/Profile";
import { ProfileType } from "@/types/profile.type";

interface Props {
    role: string | null;
    data?: ProfileType;
    setData: React.Dispatch<React.SetStateAction<any>>
    loading: boolean;
    className?: string;
}

export const MyProfile: React.FC<Props> = ({ loading, role, data, setData }) => {
   
    return (
        <>  
            {
                !loading && (
                    role === "RECRUITER" ? <CompanyProfile data={data} setData={setData} loading={loading}/>
                    : <CandidateProfile data={data} setData={setData}/>
                )
            }
        </>
   )
}