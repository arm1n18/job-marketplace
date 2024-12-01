import { Check, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { LoadingSVG } from "./loadingSVG";
import { useState } from "react";
import { useWindowWidth } from "../hook/useWindowWidth";
import { useAuth } from "../hook/AuthContext";

interface Props {
    status: string;
    loading: boolean;
    onClick: (status: string) => void;
    className ?: string;
}

export const ResponseButtonsSection: React.FC<Props> = ({status, loading, onClick, className}) => {
    const screenWidth = useWindowWidth();
    const [loadingButton, setLoadingButton] = useState({succeeded: false, rejected: false});
    const { role } = useAuth();

    return (
        <>
            {status == "SUCCEEDED" && (<Button disabled={true} className={cn("", className)} variant={"succeeded"}>Схвалено</Button>)}
            {status == "REJECTED" && (<Button disabled={true} className={cn("", className)} variant={"rejected"}>Відхилено</Button>)}
            {status !== "SUCCEEDED" && status !== "REJECTED" &&
                <div className={`${screenWidth < 768 ? "w-full" : ""} flex gap-2`}>
                    <Button key="SUCCEEDED"
                        className={cn("", className)}
                        disabled={loading}
                        onClick={() => {onClick("SUCCEEDED"), setLoadingButton({...loadingButton, succeeded: true})}}
                    >
                    {loadingButton.succeeded ? <LoadingSVG /> : (screenWidth < 768 || role == "RECRUITER" ? "Прийняти" : <Check size={20}/>) }</Button>
                    <Button key="REJECTED"
                        className={cn("", className)}
                        disabled={loading}
                        variant={"outline"} 
                        onClick={() => {onClick("REJECTED"), setLoadingButton({...loadingButton, rejected: true})}}
                    >
                    {loadingButton.rejected ? <LoadingSVG theme="dark" /> : (screenWidth < 768 || role == "RECRUITER" ? "Відхилити" : <X size={20}/>)}</Button>
                </div>
            }
        </>
      )
}