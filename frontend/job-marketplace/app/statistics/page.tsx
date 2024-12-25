'use client'

import { Container } from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";
import FetchDataService from "@/services/FetchDataService";
import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Statistic {
    totalJobs: number,
    avgJobSalary: number,
    avgJobExperience: number,
    totalCandidates: number,
    avgCandidateSalary: number,
    avgCandidateExperience: number,
    totalApplications: number,
    totalAcceptedApplications: number,
    percentageOfApplications: number,
    moreJobsByCategory: MoreJobsByCategory[],
    higherSalaryByCategory: HigherSalaryByCategory[]
}

interface MoreJobsByCategory {
    name: string,
    count: number
}

interface HigherSalaryByCategory {
    name: string,
    avgSalary: number
}

interface Difference {
    jobsDifference: number,
    candidatesDifference: number,
    applicationsDifference: number
}

interface Report {
    statistics: Statistic,
    difference: Difference
}

export default function Statistic() {
    const [statistics, setStatistics] = useState<Report>();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const getStatistics = new FetchDataService({url: "statistics/", setLoading, setData: setStatistics});
        getStatistics.getData();
    }, [])

    return (
        <div className="mx-4 mb-24">
            <Container className="my-12">
                <div className="flex flex-wrap gap-4">
                    {/* {Кількість кандидатів} */}
                    <div className="bg-non-selected rounded-lg p-4 flex-grow">
                        {/* <div className="flex gap-2"><UserSearch size={20} /><h2 className="text-common-selected">Кількість кандидатів</h2></div> */}
                        <h2 className="text-common-selected">Кількість кандидатів</h2>
                        <div className="my-2 flex gap-2">
                            <span className="text-title-dark">{statistics?.statistics.totalCandidates || 0}</span>
                            <div className={`${!statistics ||statistics!.difference.candidatesDifference >= 0 ? "pending-badge" : "rejected-badge"} rounded-lg h-fit py-1 px-2 my-auto`}>
                                {
                                    !statistics ? (
                                        <span className="flex gap-2 items-center leading-none">-</span>
                                    ) : (
                                        <span className="flex gap-2 items-center leading-none">{statistics!.difference.candidatesDifference >= 0 ? <TrendingUp size={12} /> :<TrendingDown size={12} />}{statistics?.difference.candidatesDifference}</span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="text-common gap-4 flex w-full justify-between">Середня бажана з/п <p className="w-fit">${statistics?.statistics.avgCandidateSalary || 0}</p></div>
                        <div className="text-common gap-4 flex w-full justify-between">Середній досвід кандидата <p className="w-fit">{statistics?.statistics.avgCandidateExperience.toFixed(1) || 0} р</p></div>
                    </div>
                    {/* {Кількість вакансій} */}
                    <div className="bg-non-selected rounded-lg p-4 flex-grow">
                    {/* <div className="flex gap-2"><BriefcaseBusiness size={20} /><h2 className="text-common-selected">Кількість вакансій</h2></div> */}
                        <h2 className="text-common-selected">Кількість вакансій</h2>
                         <div className="my-2 flex gap-2">
                            <span className="text-title-dark">{statistics?.statistics.totalJobs || 0}</span>
                            <div className={`${!statistics || statistics!.difference.jobsDifference >= 0 ? "pending-badge" : "rejected-badge"} rounded-lg h-fit py-1 px-2 my-auto`}>
                                {
                                    !statistics ? (
                                        <span className="flex gap-2 items-center leading-none">-</span>
                                    ) : (
                                        <span className="flex gap-2 items-center leading-none">{statistics?.difference?.jobsDifference >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{statistics?.difference.jobsDifference}</span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="text-common gap-4 flex w-full justify-between">Середня пропонована з/п <p>${statistics?.statistics.avgJobSalary || 0}</p></div>
                        <div className="text-common gap-4 flex w-full justify-between">Середній досвід на вакансію <p>{statistics?.statistics.avgJobExperience.toFixed(1) || 0} р</p></div>
                    </div>
                    {/* {Відсоток найму за місяць} */}
                    <div className="bg-non-selected rounded-lg p-4 flex-grow">
                    {/* <div className="flex gap-2"><Handshake size={20} /><h2 className="text-common-selected">Відсоток найму за місяць</h2></div> */}
                    <h2 className="text-common-selected">Відсоток найму за місяць</h2>
                         <div className="my-2 flex gap-2">
                            <span className="text-title-dark">{statistics?.statistics.percentageOfApplications || 0}%</span>
                            <div className={`${!statistics || statistics!.difference.applicationsDifference >= 0 ? "pending-badge" : "rejected-badge"} rounded-lg h-fit py-1 px-2 my-auto`}>
                                {
                                    !statistics ? (
                                        <span className="flex gap-2 items-center leading-none">-</span>
                                    ) : (
                                        <span className="flex gap-2 items-center leading-none">{statistics!.difference.applicationsDifference >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{statistics?.difference.applicationsDifference}%</span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="w-full justify-between flex text-common">
                            <p>{statistics?.statistics.totalApplications || 0} надіслано</p>
                            <p>{statistics?.statistics.totalAcceptedApplications || 0} прийнято</p>
                        </div>
                        <div className="flex w-full">
                            <div className={`h-4 rounded-l-lg ${statistics?.statistics.percentageOfApplications == 100 && 'rounded-r-lg'} bg-[#1C64EE]`} style={{ width: `${statistics?.statistics.percentageOfApplications}%` }}></div>
                            <div className={`h-4 ${statistics?.statistics.percentageOfApplications == 0 || !statistics?.statistics.percentageOfApplications ? 'rounded-lg' : 'rounded-r-lg'}  bg-[#1C64EE] bg-opacity-20`} style={{ width: `${100 - (statistics?.statistics.percentageOfApplications ?? 0)}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap my-4 gap-4">
                    {/* {Топ категорій за кількістю вакансій} */}
                    <div className="bg-non-selected rounded-lg p-4 flex-grow">
                        {/* <div className="flex gap-2"><UserSearch size={20} /><h2 className="text-common-selected">Кількість кандидатів</h2></div> */}
                        <h2 className="text-common-selected mb-2">Топ категорій за кількістю вакансій</h2>
                        <div className="flex gap-2">
                            <p className="text-common-selected">1</p>
                            <div className="gap-4 flex w-full justify-between items-center">
                            {loading ? <Skeleton className="w-1/3 h-4" /> : ""}
                            <h2 className="text-title hover:underline"><Link href={`/jobs?category=${encodeURIComponent(statistics?.statistics.moreJobsByCategory[0].name ?? '')}`}>
                                {statistics?.statistics.moreJobsByCategory[0].name}</Link></h2>
                                <p className="text-common">{statistics?.statistics.moreJobsByCategory[0].count || 0}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-common-selected">2</p>
                            <div className="gap-4 flex w-full justify-between items-center">
                            {loading ? <Skeleton className="w-1/3 h-4" /> : ""}
                            <h2 className="text-title hover:underline"><Link href={`/jobs?category=${encodeURIComponent(statistics?.statistics.moreJobsByCategory[1].name ?? '')}`}>
                                {statistics?.statistics.moreJobsByCategory[1].name}</Link></h2>
                                <p className="text-common">{statistics?.statistics.moreJobsByCategory[1].count || 0}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-common-selected">3</p>
                            <div className="gap-4 flex w-full justify-between items-center">
                            {loading ? <Skeleton className="w-1/3 h-4" /> : ""}
                            <h2 className="text-title hover:underline"><Link href={`/jobs?category=${encodeURIComponent(statistics?.statistics.moreJobsByCategory[2].name ?? '')}`}>
                                {statistics?.statistics.moreJobsByCategory[2].name}</Link></h2>
                                <p className="text-common">{statistics?.statistics.moreJobsByCategory[2].count || 0}</p>
                            </div>
                        </div>
                    </div>
                    {/* Топ категорій за середньою зарплатою} */}
                    <div className="bg-non-selected rounded-lg p-4 flex-grow">
                        {/* <div className="flex gap-2"><UserSearch size={20} /><h2 className="text-common-selected">Кількість кандидатів</h2></div> */}
                        <h2 className="text-common-selected mb-2">Топ категорій за середньою зарплатою</h2>
                        <div className="flex gap-2">
                            <p className="text-common-selected">1</p>
                            <div className="gap-4 flex w-full justify-between items-center">
                                {loading ? <Skeleton className="w-1/3 h-4" /> : ""}
                                <h2 className="text-title hover:underline"><Link href={`/jobs?category=${encodeURIComponent(statistics?.statistics.higherSalaryByCategory[0].name ?? "")}`}>
                                    {statistics?.statistics.higherSalaryByCategory[0].name}</Link></h2>
                                <p className="text-common">${statistics?.statistics.higherSalaryByCategory[0].avgSalary || 0}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-common-selected">2</p>
                            <div className="gap-4 flex w-full justify-between items-center">
                                {loading ? <Skeleton className="w-1/3 h-4" /> : ""}
                                <h2 className="text-title hover:underline"><Link href={`/jobs?category=${encodeURIComponent(statistics?.statistics.higherSalaryByCategory[1].name ?? "")}`}>
                                    {statistics?.statistics.higherSalaryByCategory[1].name}</Link></h2>
                                <p className="text-common">${statistics?.statistics.higherSalaryByCategory[1].avgSalary || 0}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-common-selected">3</p>
                            <div className="gap-4 flex w-full justify-between items-center">
                                {loading ? <Skeleton className="w-1/3 h-4" /> : ""}
                                <h2 className="text-title hover:underline"><Link href={`/jobs?category=${encodeURIComponent(statistics?.statistics.higherSalaryByCategory[2].name ?? "")}`}>
                                    {statistics?.statistics.higherSalaryByCategory[2].name}</Link></h2>
                                <p className="text-common">${statistics?.statistics.higherSalaryByCategory[2].avgSalary || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}