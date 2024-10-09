import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { Container } from "../Container";
import { Button } from "../ui/button";

interface Props {
    className ?: string;
}


export const Header: React.FC<Props> = ({ className }) => {
    return (
        <header className={cn('h-16 border-primary border-gray-primary ', className)}>
            <Container className="flex items-center h-full">
                    <div className="flex justify-between w-full h-full">
                        <ul className="flex items-center gap-6">
                            <li><Link className="text-common" href="/jobs">Вакансії</Link></li>
                            <li><Link className="text-common" href="/candidates">Кандидати</Link></li>
                        </ul>

                        <div className="flex items-center gap-6">
                            <Button asChild
                                variant="outline">
                                <Link href="/login">Увійти</Link>
                            </Button>
                            <Button asChild className="w-[160px]">
                                <Link href="/register">Зареєструватись</Link>
                            </Button>
                        </div>
                    </div>
            </Container>
        </header>
    )
}