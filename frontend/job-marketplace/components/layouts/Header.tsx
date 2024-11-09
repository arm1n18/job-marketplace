'use client'

import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "../Container";
import Link from "next/link";
import { Button } from "../ui/button";
import { ProfileButton } from "../ui/profileButton";
import { useAuth } from "../hook/isLoggedIn";

interface Props {
    className ?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    const {isLoggedIn} = useAuth();
    

    return (
        <nav className={cn('h-16 border-primary border-gray-primary-b bg-white', className)}>
            <Container className="flex items-center h-full">
                    <div className="flex justify-between w-full h-full">
                        <div className="flex justify-between gap-6 items-center">
                            <Link href="/"><img src="/images/logo/joobly-logo-blue.svg" alt="joobly-logo" className="h-8" draggable="false"/></Link>
                            <ul className="flex items-center gap-6">
                                <li><Link className="text-common" href="/jobs">Вакансії</Link></li>
                                <li><Link className="text-common" href="/candidates">Кандидати</Link></li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-6">
                            {!isLoggedIn ? 
                            (<>
                                <Button asChild
                                    variant="outline">
                                    <Link href="/login">Увійти</Link>
                                </Button>
                                <Button asChild className="w-[160px]">
                                    <Link href="/register">Зареєструватись</Link>
                                </Button>
                            </>)
                            :  (<ProfileButton />)
                            }
                        </div>
                    </div>
            </Container>
        </nav>
    )
}