import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { Container } from "../Container";

interface Props {
    className ?: string;
}


export const Footer: React.FC<Props> = ({ className }) => {
    return (
        <footer className={cn('border-primary border-gray-primary-t bg-white mt-48 mx-2 py-10', className)}>
            <Container className="flex items-center h-full">
                        <div className="flex w-full justify-between">
                            <div className="flex flex-col">
                                <a href="/"><img src="/images/logo/joobly-logo-blue.svg" alt="joobly-logo" className="h-8" draggable="false"/></a>
                                <div className="flex-grow"></div>
                                <p className="text-common">© 2024 Joobly.ua</p>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-common-dark mb-2">Кандидатові</p>
                                <ul>
                                    <li><Link className="text-common hover:underline" href="/jobs">Вакансії</Link></li>
                                    <li><Link className="text-common hover:underline" href="/jobs">Створити резюме</Link></li>
                                    <li><Link className="text-common hover:underline" href="/jobs">Як скласти резюме</Link></li>
                                </ul>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-common-dark mb-2">Роботодавцю</p>
                                <ul>
                                    <li><Link className="text-common hover:underline" href="/candidates">Створити вакансію</Link></li>
                                    <li><Link className="text-common  hover:underline" href="/candidates">Знайти резюме</Link></li>
                                    <li><Link className="text-common  hover:underline" href="/candidates">Як створити вакансію</Link></li>
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