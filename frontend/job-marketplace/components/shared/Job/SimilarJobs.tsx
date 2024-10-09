import { cn } from "@/lib/utils";
import { Job } from "./JobDetailsTypes";

interface Props extends Job {
    className ?: string;
}

export const SimilarJobs: React.FC<Props> = ({ className, title, city, salary_to }) => {
    return (
        <>  
            <div className={cn("w-full rounded-lg px-20 py-10 bg-gray-selected my-12", className)}>
                <p className="text-title-dark">Схожі вакансії</p>

                <div className="grid grid-cols-2 gap-2 mt-7">
                        <div className="flex-col">
                            <div>
                                <span className="text-common-blue"><a href="">{title}</a></span>
                                <span className="text-common"> в Nova Digital</span>
                            </div>
                            <div className="text-common">
                                {city} до {salary_to}
                            </div>
                        </div>
                        <div className="flex-col">
                            <div>
                                <span className="text-common-blue"><a href="">{title}</a></span>
                                <span className="text-common"> в Nova Digital</span>
                            </div>
                            <div className="text-common">
                                {city} до {salary_to}
                            </div>
                        </div>
                        <div className="flex-col">
                            <div>
                                <span className="text-common-blue"><a href="">{title}</a></span>
                                <span className="text-common"> в Nova Digital</span>
                            </div>
                            <div className="text-common">
                                {city} до {salary_to}
                            </div>
                        </div>
                        <div className="flex-col">
                            <div>
                                <span className="text-common-blue"><a href="">{title}</a></span>
                                <span className="text-common"> в Nova Digital</span>
                            </div>
                            <div className="text-common">
                                {city} до {salary_to}
                            </div>
                        </div>
                        <div className="flex-col">
                            <div>
                                <span className="text-common-blue"><a href="">{title}</a></span>
                                <span className="text-common"> в Nova Digital</span>
                            </div>
                            <div className="text-common">
                                {city} до {salary_to}
                            </div>
                        </div>
                        <div className="flex-col">
                            <div>
                                <span className="text-common-blue"><a href="">{title}</a></span>
                                <span className="text-common"> в Nova Digital</span>
                            </div>
                            <div className="text-common">
                                {city} до {salary_to}
                            </div>
                        </div>
                </div>
            </div>
        </>
    )
}