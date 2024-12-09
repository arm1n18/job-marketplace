import { useEffect, useRef } from "react";
import { JobCardSkeleton } from "../shared/Skeletons";
import { JobCard } from "../shared";
import { X } from "lucide-react";
import { Button } from "./button";
import { Job } from "@/types";

interface Props {
    opened: boolean;
    loading: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;

    selectedJob: Job | null;
    jobs: Job[] | null;
    onClick: (key: string) => void;
}

export const SideMenu: React.FC<Props> = ({ opened, setOpened, onClick, loading, setSelectedJob, selectedJob, jobs}) => {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const openedRef = useRef<boolean>(opened);

    const handleClickOutside = (e: MouseEvent) => {
        if (overlayRef.current && !overlayRef.current.contains(e.target as HTMLElement)) {
            setOpened(false);
        }
    };

    useEffect(() => {
        openedRef.current = opened;

        if (opened) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [opened]);

    return (
        <>
            {
                opened && (
                    <div className="overlay absolute flex items-center justify-center top-64 left-0 right-0" ref={overlayRef}>
                        <div className="bg-white p-4 top-0 right-0 h-full ml-auto flex flex-col z-30">
                            <X className="w-4 h-4 mb-4 text-common cursor-pointer" onClick={() => setOpened(!opened)}/>
                            <div className="flex flex-col overflow-auto scrollbar">
                                {loading && Array.from({ length: 3 }).map((_, index) => (
                                    <JobCardSkeleton key={index} className={`${index != 2 ? 'mb-3' : ''} w-[448px]`}/>
                                ))}
                                {!loading && jobs != null && jobs.length > 0 && jobs.map((job, index: number) => (
                                        <JobCard
                                        className={`${index != jobs.length - 1 ? 'mb-3' : ''} ${selectedJob === job ? 'bg-gray-selected' : 'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200 w-full max-w-md`}
                                        key={job.id}
                                        onClick={() => setSelectedJob(job)}
                                        data={job}
                                        keyInfo={[
                                            job.city_name || "Україна",
                                            job.employment_name ?? "",
                                            job.experience
                                                ? `${job.experience.toString()} ${job.experience > 4 ? "років" : (job.experience > 1 ? "роки" : "рік")} досвіду`
                                                : "Без досвіду",
                                            job.subcategory_name ?? job.category_name ?? "",
                                        ]}/>
                                    ))}
                            </div>
                                <Button className="max-w-md w-full mt-4"
                                    disabled={loading}
                                    onClick={() =>{onClick("OFFER_PENDING"),
                                    setOpened(!opened)}}>
                                        Запропонувати вакансію
                                </Button>
                        </div>
                    </div> 
                )
            }
        </>
    )
}