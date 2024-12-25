import { Check, ExternalLink, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { LoadingSVG } from "./loadingSVG";
import { useState } from "react";
import { useWindowWidth } from "../hook/useWindowWidth";
import { useAuth } from "../hook/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
    status: string;
    loading: boolean;
    onClick: (status: string) => void;
    id?: number;
    route?: string
    className ?: string;
}

export const ResponseButtonsSection: React.FC<Props> = ({status, loading, onClick, className, id, route}) => {
    const screenWidth = useWindowWidth();
    const [loadingButton, setLoadingButton] = useState({succeeded: false, rejected: false});
    const { role } = useAuth();
    const pathname = usePathname();
    const currentPath = pathname.split("/")[1];
    
    const handleClick = (status: string) => {
        if (status === "SUCCEEDED") {
            setLoadingButton(prev => ({ ...prev, succeeded: true }));
        } else if (status === "REJECTED") {
            setLoadingButton(prev => ({ ...prev, rejected: true }));
        }

        setTimeout(() => {
            onClick(status);
            setLoadingButton((prev) => ({
                ...prev,
                succeeded: status === "SUCCEEDED" ? false : prev.succeeded,
                rejected: status === "REJECTED" ? false : prev.rejected,
            }));
        }, 100); 
    };

   
    const href = (currentPath == "candidates" && screenWidth > 768 ? "/inbox" : `/response/${route}/${id}`)
    return (
        <>
            {status == "SUCCEEDED" && (<Button className={cn("", className)} variant={"succeeded"} size="sm">
                <Link href={href} className="flex gap-2 items-center">Схвалено<ExternalLink size={16} /></Link>
            </Button>)}
            {status == "REJECTED" && (<Button disabled={true} className={cn("", className)} variant={"rejected"} size="sm">Відхилено</Button>)}
            {status !== "SUCCEEDED" && status !== "REJECTED" &&
                    (
                        
                            <div className={`${screenWidth < 768 ? "w-full" : ""} flex gap-2`}>
                            <Button key="SUCCEEDED"
                                size="sm"
                                className={cn("", className)}
                                disabled={loading}
                                onClick={() => {onClick("SUCCEEDED"); handleClick("SUCCEEDED")}}
                            >
                            {loadingButton.succeeded ? <LoadingSVG /> : (screenWidth < 768 || role == "RECRUITER" ? "Прийняти" : <Check size={20}/>) }</Button>
                            <Button key="REJECTED"
                            size="sm"
                            className={cn("", className)}
                            disabled={loading}
                            variant={"outline"} 
                            onClick={() => {onClick("REJECTED"); setLoadingButton({...loadingButton, rejected: true})}}
                            >
                            {loadingButton.rejected ? <LoadingSVG theme="dark" /> : (screenWidth < 768 || role == "RECRUITER" ? "Відхилити" : <X size={20}/>)}</Button>
                            </div>
                        
                    )
            }
        </>
      )
}