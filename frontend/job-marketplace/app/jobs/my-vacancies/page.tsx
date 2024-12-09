"use client";

import { Container } from "@/components/Container";
import { JobCard } from "@/components/shared";
import { NothingFound } from "@/components/shared/nothingFound";
import { JobCardSkeleton } from "@/components/shared/Skeletons";
import { Button, Input } from "@/components/ui";
import FetchDataService from "@/services/FetchDataService";
import { Job } from "@/types";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyVacanciesPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const getJobs = new FetchDataService({url: "company/jobs", setLoading, setData: setJobs});
        getJobs.getData();
    }, []);

    if(!jobs) return (
        <div className="mx-4 mb-24">
            <Container className="mt-12 relative">
                <div className="max-w-96 mx-auto">
                    <NothingFound type={"notFound"} className="mb-4"/>
                    <Button className="w-full" disabled={loading}><Link href="/jobs/create">Створити вакансію</Link></Button>
                </div>
            </Container>
        </div>
    );

    return (
        <div className="mx-4 mb-24">
            <Container className="mt-12 relative">
                <h1 className="text-title-dark my-12">{`Вакансій ${jobs.length}`}<span className="text-title-blue">{}</span></h1>
                <div className="flex flex-col md:flex-row gap-4 my-12">
                    <div className="relative flex-grow mb-4">
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={"Пошук за назвою чи категорією"}
                            className="bg-[#F9FAFB] pr-10"
                        />
                        {search.length > 0 ? (
                                <X className="absolute top-1/2 right-3 h-5 text-[#D0D5DD] -translate-y-1/2 cursor-pointer" onClick={() => setSearch("")}/>
                            )  : (<Search className="absolute top-1/2 right-3 h-5 text-[#D0D5DD] -translate-y-1/2 pointer-events-none" />)
                        }

                    </div>
                    <Button disabled={loading}><Link href="/jobs/create">Створити вакансію</Link></Button>
                </div>
                <div className="w-full">
                    <div className="flex flex-wrap-reverse gap-2">
                        {loading && Array.from({ length: 4 }).map((_, index) => (
                            <JobCardSkeleton key={index} className="mb-3 w-full"/>
                        ))}
                        {!loading && jobs != null && jobs.length > 0 && jobs.map((job, index: number) => (
                            (job.title!.toLowerCase().includes(search.toLowerCase()) || job.category_name!.toLowerCase().includes(search.toLowerCase())) &&
                            (
                                <JobCard
                                    className={`${'bg-non-selected'} hover:bg-[#F7F7F8] transition duration-200 w-full`}
                                    key={index}
                                    data={job}
                                    keyInfo={[
                                        job.city_name || "Україна",
                                        job.employment_name ?? "",
                                        job.experience
                                            ? `${job.experience.toString()} ${job.experience > 4 ? "років" : (job.experience > 1 ? "роки" : "рік")} досвіду`
                                            : "Без досвіду",
                                        job.subcategory_name ?? job.category_name ?? "",
                                ]}/>
                            )
                        ))}
                    </div>
                </div>
                <div className="mt-12 text-common"><Link href="/jobs">Переглянути всі вакансії на сайті</Link></div>
            </Container>
        </div>
    )
}