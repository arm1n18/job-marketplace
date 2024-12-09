'use client'

import { Container } from "@/components/Container";
import { useQueryParams } from "@/components/hook";
import { SearchInput } from "@/components/shared";
import { NothingFound } from "@/components/shared/nothingFound";
import { NoImgAvatars, SectionDescription } from "@/components/ui";
import FetchDataService from "@/services/FetchDataService";
import { CompaniesList } from "@/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Companies() {
    const [companies, setCompanies] = useState<CompaniesList[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams() as URLSearchParams
    const searchFilter = searchParams.get('search')
    const router = useRouter();
    const params = useQueryParams(searchFilter);
    
    useEffect(() => {
        const getCompanies = new FetchDataService({url: "company/", params, setLoading, setData: setCompanies});
        getCompanies.getData();
    }, [searchFilter]);

    const handleSearch = async (query: string) => {
      if(query.trim() === "") router.push(`/company`);
      if( query.length < 2) return;
      router.push(`/company?search=${query}`);
  }

    const AVGsalary = (AVGsalary: number) => {
        if(AVGsalary == 0) {
            return "-"
        } else {
            return "$" + AVGsalary.toFixed(0)
        }
    }

    return (
        <div className="mx-4 mb-24">
            <Container className="mt-12 relative">
                <h1 className="text-title-dark my-12">Пошук за компаніями</h1>
                <SearchInput className="w-full" onSearch={handleSearch} />
                
                <div className="flex flex-col gap-4 my-12">
                    {!loading && !companies && 
                        <NothingFound type={"notFound"} />
                    }
                    {
                        !loading && companies && companies.map((company, index) => (
                            <div key={index} className="rounded-lg p-8 w-full bg-non-selected">
                                <div className="flex max-sm:flex-col gap-6">
                                    {
                                        company.image_url ? (
                                            <img className="rounded-[8px] w-16 h-16" src={company.image_url} alt="" />
                                        ) : (<NoImgAvatars className="rounded-[8px] w-16 h-16 text-2xl shrink-0" name={company.company_name} />
                                        )
                                    }
                                    <div className="flex flex-col">
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-title-bg leading-none hover:underline"><Link href={`/company/${company.company_name!.replace(' ', '-')}`}>{company.company_name}</Link></h2>
                                            <ul className="flex gap-4">
                                                <li className="text-common">вакансій <span className="text-common-blue">{company.total_jobs}</span></li>
                                                <li className="text-common">середня з/п <span className="text-common-blue">{AVGsalary(company.average_salary!)}</span></li>
                                            </ul>
                                        </div>
                                        <SectionDescription  description={company.about_us} />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Container>
        </div>
    )
}