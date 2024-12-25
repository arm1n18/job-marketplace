'use client';

import FetchDataService from "@/services/FetchDataService";
import { useEffect, useState } from "react"
import { Container } from "@/components/Container";
import Link from "next/link";
import { NoImgAvatars } from "@/components/ui";
import { useAuth } from "@/components/hook";
import Image from 'next/image';
import { NothingFound } from "@/components/shared/nothingFound";

export interface Data {
    jobID: number;
    resumeID: number;
    company_name: string;
    email: string;
    jobTitle: string;
    resumeTitle: string;
    imageUrl: string;
    phone: string;
    recruiter_name: string;
}

export default function ResumeResponse({ params: { id } }: { params: { id: number } }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Data | null>(null);
    const { role } = useAuth();
    
    useEffect(() => {
        const getResumeByID = new FetchDataService({url: `response/offer/${id}`, setLoading, setData: setData});
        getResumeByID.getData();
    }, [id]);

    if(!loading && !data) {
        return (
            <div className="mx-4 mb-24">
                <Container className="my-12">
                    <NothingFound type={"notFound"} />
                </Container >
            </div>
        )
    }
    return (
        <div className="mx-4 mb-24">
            <Container className="my-12">
                <div className="max-md:w-full max-w-[976px] rounded-md bg-[#EAF7DF] border border-opacity-30 border-[#5A9B22] p-2 mb-6">
                    <h1 className="text-center font-bold text-[#5A9B22]">{role === "CANDIDATE" ? "Рекрутер отримав доступ до ваших контактів." : "Кандидат надава доступ до своих контактів."} </h1>
                    <p className="text-center text-[#5A9B22]">В результаті прийняття вакансії, чи резюме, контаки обох сторін були розкриті
                        {/* <i className="text-sm">(Дані, які були розкриті протилежній стороні, містять лише ту інформацію, яку ви вказали при заповненні профілю)</i> */}
                    </p>
                </div>
                {
                    role === "RECRUITER" ? (
                        <div className="flex flex-col">
                            <ul className="mt-8">
                                <li><p className="text-common-dark">Контакти кандидата:</p></li>
                                <li className="flex gap-1"><p className="text-common-dark">Номер телефону:</p><p className="text-common-blue align-bottom"><i>відсутній</i></p></li>
                                <li className="flex gap-1"><p className="text-common-dark">Email:</p><p className="text-common-blue align-bottom">{data?.email}</p></li>
                                <li className="flex gap-1"><p className="text-common-dark">GitHub:</p><p className="text-common-blue align-bottom"><i>відсутній</i></p></li>
                            </ul>
                            <div className="mt-8 text-common">
                                Дякую за виявлений інтерес до резюме <Link href={`/candidates/${data?.resumeID}`} className="text-common-blue hover:underline">{data?.resumeTitle}</Link>. <br />
                                Та запропоновану вакансію <Link href={`/jobs/${data?.jobID}`} className="text-common-blue hover:underline">{data?.jobTitle}</Link>. <br />
                            </div>
                            <p className="text-common mt-8">До побачення!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="flex max-md:flex-col gap-4 md:items-center">
                                {data?.imageUrl ? (
                                        <Image className="rounded-xl size-12 md:size-16 object-cover " loading="lazy" src={data?.imageUrl} alt={`${data.company_name} logo`} />
                                    ) : (<NoImgAvatars className="rounded-xl size-12 md:size-16 text-2xl" name={data?.company_name || ""} />)}
                                <div>
                                    <h1 className="text-common-selected">Вітаю!</h1>
                                    <div className="text-common-selected flex gap-1 flex-wrap">
                                        Мене звати <p className="text-common-blue">{data?.recruiter_name},</p> я рекрутер в компанії <Link href={`/company/${data?.company_name}`} className="text-common-blue hover:underline">{data?.company_name}</Link>.
                                    </div>
                                </div>
                            </div>
                            <ul className="mt-8">
                                <li><p className="text-common-dark">Мої контакти:</p></li>
                                <li className="flex gap-1"><p className="text-common-dark">Номер телефону:</p><p className="text-common-blue align-bottom">+{data?.phone}</p></li>
                                <li className="flex gap-1"><p className="text-common-dark">Email:</p><p className="text-common-blue align-bottom">{data?.email}</p></li>
                            </ul>
                            <div className="mt-8 text-common">
                                Дякуємо за виявлений інтерес до вакансії <Link href={`/jobs/${data?.jobID}`} className="text-common-blue hover:underline">{data?.jobTitle}</Link>. <br />
                                Ми раді повідомити, що запропонуване вами  резюме, було схвалено і Ви були обрані для подальшого розгляду.<br />
                                Найближчим часом, ми зв&apos;яжемося з Вами для обговорення деталей наступного кроку.
                            </div>
                            <p className="text-common mt-8">До побачення!</p>
                        </div>
                    )
                }
            </Container>
        </div>
    )
}