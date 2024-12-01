import { useAuth } from "@/components/hook/AuthContext";
import { Button } from "@/components/ui/button";
import { NoImgAvatars } from "@/components/ui/noImgAvatars";
import { LogOut, Menu, PencilLine, Search, Send, UserSearch, X } from "lucide-react"
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Props {
    className?: string
}

export const MobileSideMenu: React.FC<Props> = ({ className }) => {
    const [opened, setOpened] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const openedRef = useRef<HTMLDivElement>(null);
    const {role, avatarUrl, email} = useAuth();

    useEffect(() => {
        if (!overlayRef.current) {
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            overlayRef.current = overlay;
        }
        
        const overlay = overlayRef.current;

        if (typeof window !== 'undefined') {
            if(opened) {
                document.body.style.overflow = 'hidden';
                document.body.appendChild(overlay);
            } else {
                document.body.style.overflow = '';
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }
        }
        
        const handleClickOutside = (e: MouseEvent) => {
            if(opened && openedRef.current && !openedRef.current.contains(e.target as HTMLElement)) {
                setOpened(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
    }, [opened]);
    
    return (
        <>
            <div className={`my-auto ${opened ? "bg-white z-30 w-3/4 absolute top-0 left-0 h-screen overflow-y-auto" : ""} md:hidden`}>
                {!opened ? (
                    <div className="px-2 py-1 border border-black/10 text-common rounded-md" onClick={() => setOpened(!opened)}>
                        <Menu className="hidden max-md:block cursor-pointer"/>
                    </div>
                ):
                <div className="" ref={openedRef}>
                    
                    <div className="flex justify-between px-4 py-4">
                        <img src="/images/logo/joobly-logo-blue.svg" alt="joobly-logo" className="h-8 mb-4" draggable="false"/>
                        <X size={24} className="text-common" onClick={() => setOpened(!opened)}/>
                    </div>

                    <div className="text-common-dark py-4 border-b w-full border-[#D0D5DD] first-letter:py-4 px-4" onClick={() => setOpened(!opened)}>
                        <Link href="/profile" className="flex gap-2">
                            {
                                avatarUrl ? 
                                (<img src={avatarUrl} alt="avatar" className="rounded-full w-14 h-14" />) 
                                : (<NoImgAvatars className="rounded-full w-14 h-14 text-2xl" name={String(email)}/>)
                            }
                            <div className="flex flex-col justify-between overflow-hidden">
                                <p className="text-lg font-bold truncate">{email}</p>
                                <span className="text-common">Мій профіль</span>
                            </div>
                        </Link>
                        
                    </div>

                    <ul className="">
                        <li className="hover:bg-[#F7F7F8] filters-block-mobile py-4 px-4" onClick={() => setOpened(!opened)}><Link href="/jobs" className="gap-4 flex"><Search color="#1C64EE" />Пошук вакансій</Link></li>
                        <li className="hover:bg-[#F7F7F8] filters-block-mobile py-4 px-4" onClick={() => setOpened(!opened)}><Link href="/candidates" className="gap-4 flex"><UserSearch color="#1C64EE" />Пошук кандидатів</Link></li>
                        <li className="hover:bg-[#F7F7F8] filters-block-mobile py-4 px-4" onClick={() => setOpened(!opened)}><Link href="/candidates" className="gap-4 flex"><Send color="#1C64EE" />Мої відгуки</Link></li>
                        {role === "RECRUITER" &&
                            <li className="hover:bg-[#F7F7F8] filters-block-mobile py-4 px-4" onClick={() => setOpened(!opened)}><Link href="/jobs/create" className="gap-4 flex"><PencilLine color="#1C64EE" />Створити вакансію</Link></li>
                        }
                        {
                            role === "CANDIDATE" &&
                            <li className="hover:bg-[#F7F7F8] filters-block-mobile py-4 px-4" onClick={() => setOpened(!opened)}><Link href="/jobs/create" className="gap-4 flex"><PencilLine color="#1C64EE" />Створити резюме</Link></li>
                        }
                    </ul>
                    
                    <div className="fixed bottom-4 gap-4 flex flex-col px-4">
                        <Button variant={"outline"} className="gap-4"><LogOut size={16}/>Вийти</Button>
                        <p className="text-common">© 2024 Joobly.ua</p>
                    </div>
                </div>
                }
            </div>

        </>
    )
}