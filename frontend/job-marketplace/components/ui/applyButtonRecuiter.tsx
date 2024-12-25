import { useAuth } from "../hook/AuthContext";
import { Button } from "./button"
import { cn } from "@/lib/utils";
import { LoadingSVG } from "./loadingSVG";

interface Props {
    roleAccess: string;
    status: string;
    loading: boolean;
    jobsList: boolean;
    setJobsList: (key: boolean) => void;
    className ?: string;
}

export const ApplyButtonRecruiter: React.FC<Props> = ({roleAccess, status, className, loading, setJobsList}) => {
    const { loggedIn, role } = useAuth();

    
    let title = ''

    if (status === "") {
        title = "Відгукнутись";
    } else if (status === "OFFER_PENDING") {
        title = "Очікується";
    }

    if (role === roleAccess && loggedIn) {
        return(
            <Button className={cn("", className)} onClick={() => setJobsList(true)} disabled={loading || status !== ""}>
                {loading ? <div className="flex gap-2 ">
                    <LoadingSVG />Зачекайте</div> : title}
            </Button>
        )
    }
}