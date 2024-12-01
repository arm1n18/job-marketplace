import { cn } from "@/lib/utils";
import { Job } from "@/types";

interface Props extends Job {
    className ?: string;
}

export const SimilarJobs: React.FC<Props> = ({ className, title, city, salary_to }) => {
    return (
        <>  
            <div className={cn("w-full rounded-lg px-8 py-10 md:bg-[#F7F7F8] md:border md:border-[#D0D5DD] my-12 max-md:mt-0", className)}>
                <p className="text-title-dark">Схожі вакансії</p>

                <div className="grid grid-cols-2 gap-2 mt-7 max-sm:flex max-sm:flex-col">
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