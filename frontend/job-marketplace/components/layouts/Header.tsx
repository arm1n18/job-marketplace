'use client'

import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { Container } from "../Container";
import Link from "next/link";
import { ProfileButton } from "../ui/profileButton";
import { useAuth } from "../hook/AuthContext";
import { Menu } from "lucide-react";
import { AuthButtons } from "../shared/AuthButtons";
import { useWindowWidth } from "../hook/useWindowWidth";
import { MobileUpperMenu } from "../shared/MobileComponents";

interface Props {
    className ?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    const [openedMobileMenu, setOpenedMobileMenu] = React.useState(false);
    const screenWidth = useWindowWidth();
    const {loggedIn} = useAuth();

    useEffect(() => {
        if(screenWidth >= 768) setOpenedMobileMenu(false);
    }, [screenWidth])

    return (
        <nav className={cn(`h-16 border-primary border-gray-primary-b px-4 ${openedMobileMenu ? "fixed top-0 left-0 z-50 w-full border-black/10 " : ""}`, className)}>
            <Container className="flex flex-col items-center h-full">
                    {openedMobileMenu && <MobileUpperMenu openedMobileMenu={openedMobileMenu} setOpenedMobileMenu={setOpenedMobileMenu}/>}
                    <div className={`flex justify-between items-center w-full h-full bg-white ${openedMobileMenu ? "pb-4 box-shadow-custom" : ""}`}>
                        {
                            loggedIn && 
                            <div className="hidden max-md:block">
                                <div className="px-2 py-1 border border-black/10 text-common rounded-md" onClick={() => setOpenedMobileMenu(!openedMobileMenu)}>
                                    <Menu className="cursor-pointer" name="menu"/>
                                </div>
                            </div>
                        }
                        <div className="gap-8 flex">
                            <Link className="mx-auto" href="/"><img src="/images/logo/joobly-logo-blue.svg" alt="joobly-logo" className="h-8" draggable="false"/></Link>     
                            <ul className="flex items-center gap-8 max-md:hidden h-full my-auto">
                                <li><Link className="text-common-dark hover:text-[#1C64EE]" href="/jobs">Вакансії</Link></li>
                                <li><Link className="text-common-dark hover:text-[#1C64EE]" href="/candidates">Кандидати</Link></li>
                                {loggedIn && <li><Link className="text-common-dark hover:text-[#1C64EE]" href="/inbox">Відгуки</Link></li>}
                            </ul>
                        </div>
                        <div className="flex float-right items-center">
                            {!loggedIn ? 
                            (<AuthButtons />)
                            :  (<ProfileButton />)
                            }
                        </div>
                    </div>
            </Container>
        </nav>
    )
}