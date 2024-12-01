import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { Container } from "../Container";

interface Props {
    className ?: string;
}


export const Footer: React.FC<Props> = ({ className }) => {
    return (
        <footer className={cn('border-primary border-gray-primary-t mt-auto bg-white w-full py-8', className)}>
            <Container className="flex items-center h-full">
                        <div className="flex max-sm:flex-col max-sm:gap-2 w-full justify-between mx-4">
                            <div className="flex flex-col">
                                <a href="/"><img src="/images/logo/joobly-logo-blue.svg" alt="joobly-logo" className="h-8" draggable="false"/></a>
                                <div className="flex-grow"></div>
                                <p className="text-common">© 2024 Joobly.ua</p>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-common-dark mb-2">Кандидатові</p>
                                <ul>
                                    <li><Link className="text-common hover:underline" href="/jobs">Знайти вакансію</Link></li>
                                    <li><Link className="text-common hover:underline" href="/candidates/create">Створити резюме</Link></li>
                                </ul>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-common-dark mb-2">Роботодавцю</p>
                                <ul>
                                    <li><Link className="text-common hover:underline" href="/jobs/create">Створити вакансію</Link></li>
                                    <li><Link className="text-common  hover:underline" href="/candidates">Знайти кандидата</Link></li>
                                </ul>
                            </div>
                            {/* <div className="flex flex-col">
                                <p className="text-common-dark mb-2">Місто</p>
                                <div className="flex gap-8">
                                    <ul>
                                        <li><Link className="text-common hover:underline" href="/jobs?city=Одеса">Одеса</Link></li>
                                        <li><Link className="text-common hover:underline" href="/jobs?city=Київ">Київ</Link></li>
                                        <li><Link className="text-common hover:underline" href="/jobs?city=Львів">Львів</Link></li>
                                    </ul>
                                    <ul>
                                        <li><Link className="text-common hover:underline" href="/jobs?city=Харків">Харків</Link></li>
                                        <li><Link className="text-common hover:underline" href="/jobs?city=Дніпро">Дніпро</Link></li>
                                        <li><Link className="text-common hover:underline" href="/jobs?city=Житомир">Житомир</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-common-dark mb-2">Категорія</p>
                                <div className="flex gap-8">
                                    <ul>
                                        <li><Link className="text-common hover:underline" href="/jobs?category=JavaScript">JavaScript</Link></li>
                                        <li><Link className="text-common hover:underline" href="/jobs?category=DevOps">DevOps</Link></li>
                                        <li><Link className="text-common hover:underline" href="/jobs?category=Android">Android</Link></li>
                                    </ul>
                                    <ul>
                                        <li><Link className="text-common hover:underline" href="/jobs?category=iOS">iOS</Link></li>
                                        <li><Link className="text-common hover:underline" href="/jobs?category=Java">Java</Link></li>
                                        <li><Link className="text-common hover:underline" href="/candidates?jobs=C++">C++</Link></li>
                                    </ul>
                                </div>
                            </div> */}
                        </div>
            </Container>
        </footer>
    )
}