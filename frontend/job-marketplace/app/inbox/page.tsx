'use client';

import { Container } from "@/components/Container";
import { useAuth } from "@/components/hook/AuthContext";
import { CandidateApplications, CandidateOffers } from "@/components/shared/Inbox";
import { RecruiterApplications } from "@/components/shared/Inbox/RecruiterApplications";
import { RecruiterOffers } from "@/components/shared/Inbox/RecruiterOffers";
import { NothingFound } from "@/components/shared/nothingFound";
import { Input } from "@/components/ui/input";
import FetchDataService from "@/services/FetchDataService";
import { Job } from "@/types";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface Data {
    applications: Job[] | null;
    offers: Job[] | null;
}

export default function InboxPage() {
    const [search, setSearch] = useState("");
    const [section, setSection] = useState(0);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Data | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const { role } = useAuth();
    const sectionNames = [`Відгуки ${data?.applications ? data.applications?.length : '0'}`, `Пропозиції ${data?.offers ? data.offers?.length : '0'}`, "Пропозиції"];

    useEffect(() => {
        const getInbox = new FetchDataService({url: "inbox/", doubleData: true, setLoading, setData: setData, setSelectedData: setSelectedJob});
        getInbox.getData();
    }, []);

    return (
        <div className="mx-4 mb-24">
            <Container className="my-12">
            <h1 className="text-title-dark my-12">{sectionNames[section] }<span className="text-title-blue">{}</span></h1>
                    <div className="flex gap-4 w-full rounded-md">
                        <div className="flex gap-2">
                            <div className={`${section == 0 ? "filters-block-selected" : "filters-block"} flex w-full`} onClick={() => {setSection(0), setSelectedJob(data?.applications?.[0] ?? null)}}>Відгуки</div>
                            <div className={`${section == 1 ? "filters-block-selected" : "filters-block"} flex w-full`} onClick={() => {setSection(1), setSelectedJob(data?.offers?.[0] ?? null)}}>Пропозиції</div>
                        </div>
                        <div className="relative flex-grow">
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={`${role == "CANDIDATE" ? "Пошук за вакансією чи назвою компанії" : "Пошук за назвою чи категорією"}`}
                                className="bg-[#F9FAFB] pr-10"
                            />

                            {search.length > 0 ? (
                                    <X className="absolute top-1/2 right-3 h-5 text-[#D0D5DD] -translate-y-1/2 cursor-pointer" onClick={() => setSearch("")}/>
                                )  : (<Search className="absolute top-1/2 right-3 h-5 text-[#D0D5DD] -translate-y-1/2 pointer-events-none" />)
                            }

                        </div>
                    </div> 

                    {section == 0 ? (
                        (!loading && !data?.applications ?
                            <NothingFound type={"noApplications"} />
                            :
                            (
                                role == "CANDIDATE" ?
                                (<CandidateApplications
                                    setSelectedJob={setSelectedJob}
                                    selectedJob={selectedJob}
                                    applications={data?.applications ?? []}
                                    search={search}
                                    loading={loading}
                                />) : (
                                    <RecruiterApplications
                                        setSelectedResume={setSelectedJob}
                                        selectedResume={selectedJob}
                                        applications={data?.applications ?? []}
                                        search={search}
                                        loading={loading}
                                    />
                                )
                            )
                        )
                        ) : (
                            (!loading && !data?.offers ?
                                <NothingFound type={"noOffers"} />
                            :
                                (
                                    role == "CANDIDATE" ? (
                                        <CandidateOffers
                                            setData={setData}
                                            data={data}
                                            setSelectedJob={setSelectedJob}
                                            selectedJob={selectedJob}
                                            applications={data?.offers ?? []}
                                            search={search}
                                            loading={loading}
                                        />
                                    ) : (
                                        <RecruiterOffers
                                            setData={setData}
                                            data={data}
                                            setSelectedResume={setSelectedJob}
                                            selectedResume={selectedJob}
                                            offers={data?.offers ?? []}
                                            search={search}
                                            loading={loading}
                                        />
                                    )
                                )
                            )
                        )
                    }
            </Container>
        </div>
    )
}