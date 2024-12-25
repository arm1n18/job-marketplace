'use client';

import { Container } from "@/components/Container";
import { useAuth } from "@/components/hook/AuthContext";
import { CandidateApplications, CandidateOffers, RecruiterOffers, RecruiterApplications } from "@/components/shared/Inbox";
import { NothingFound } from "@/components/shared/nothingFound";
import { Input } from "@/components/ui/input";
import FetchDataService from "@/services/FetchDataService";
import { Job, Resume } from "@/types";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface Data {
    applications: (Job | Resume)[] | null;
    offers: (Job | Resume)[] | null;
}

export default function InboxPage() {
    const { role } = useAuth();
    const [search, setSearch] = useState("");
    const [section, setSection] = useState(0);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Data | null>(null);
    const [selectedData, setSelectedData] = useState<Job | Resume | null>(null)
    const sectionNames = [`Відгуки ${data?.applications ? data.applications?.length : '0'}`, `Пропозиції ${data?.offers ? data.offers?.length : '0'}`, "Пропозиції"];

    useEffect(() => {
        const getInbox = new FetchDataService({url: "inbox/", doubleData: true, setLoading, setData: setData, setSelectedData: setSelectedData});
        getInbox.getData();
    }, []);

    return (
        <div className="mx-4 mb-24">
            <Container className="my-12">
            <h1 className="text-title-dark my-12">{sectionNames[section] }<span className="text-title-blue">{}</span></h1>
                    <div className="flex gap-4 w-full rounded-md">
                        <div className="flex gap-2">
                            <div className={`${section == 0 ? "filters-block-selected" : "filters-block"} flex w-full`}
                                onClick={() => {setSection(0);
                                setSelectedData(data?.applications?.[0] ?? null)
                            }
                            }>Відгуки</div>
                            <div className={`${section == 1 ? "filters-block-selected" : "filters-block"} flex w-full`} onClick={() => {setSection(1); setSelectedData(data?.offers?.[0] ?? null)}}>Пропозиції</div>
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
                                    setSelectedJob={setSelectedData as React.Dispatch<React.SetStateAction<Job | null>>}
                                    selectedJob={selectedData as Job}
                                    applications={(data?.applications ?? []) as Job[]}
                                    search={search}
                                    loading={loading}
                                />) : (
                                    <RecruiterApplications
                                        setSelectedResume={setSelectedData as React.Dispatch<React.SetStateAction<Resume | null>>}
                                        selectedResume={selectedData as Resume}
                                        applications={(data?.applications ?? []) as Resume[]}
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
                                            setSelectedJob={setSelectedData as React.Dispatch<React.SetStateAction<Job | null>>}
                                            selectedJob={selectedData as Job}
                                            applications={(data?.offers ?? []) as Job[]}
                                            search={search}
                                            loading={loading}
                                        />
                                    ) : (
                                        <RecruiterOffers
                                            setData={setData}
                                            setSelectedResume={setSelectedData as React.Dispatch<React.SetStateAction<Resume | null>>}
                                            selectedResume={selectedData as Resume}
                                            offers={(data?.offers ?? []) as Resume[]}
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