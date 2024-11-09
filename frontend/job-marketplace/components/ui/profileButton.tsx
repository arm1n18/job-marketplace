import { useEffect, useRef, useState } from "react";
import { NoImgAvatars } from "./noImgAvatars";
import { ChevronDown, ChevronUp, CircleUserRound, LogOut, Settings } from "lucide-react";
import { useAuth } from "../hook/isLoggedIn";
import { useRouter } from "next/navigation";
import { LogOutUser } from "@/lib/utils/LogOutUser";
import axios from "axios";
import { set } from "zod";
import { fetchAvatar } from "../hook/fetchAvatar";
import Link from "next/link";

interface Props {
    className?: string;
  }

export const ProfileButton: React.FC<Props> = (className) => {
    const [isOpen, setIsOpen] = useState(false);
    const openedRef = useRef<HTMLDivElement>(null);
    const {email, setIsLoggedInValue, avatarUrl, setAvatarUrl} = useAuth();
    
    useEffect(() => {
        fetchAvatar(setAvatarUrl);
    }, [])
    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(isOpen && openedRef.current && !openedRef.current.contains(e.target as HTMLElement)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    const router = useRouter();

    const handleLogOut = async () => {
        try {
            localStorage.clear();
            setIsLoggedInValue(false);
            await LogOutUser();
            router.push('/');
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="relative" ref={openedRef}>
            <div>
                <div className="flex gap-4 cursor-pointer">
                    <Link href="/profile">
                        {
                            avatarUrl ? 
                            (<img src={avatarUrl} alt="avatar" className="rounded-full w-8 h-8" />) 
                            : (<NoImgAvatars className="rounded-full w-8 h-8 text-[12px]" name={String(email)}/>)
                        }
                    </Link>
                    { isOpen ? 
                        (<ChevronUp className="size-4 ml-1 mt-2" onClick={() => setIsOpen(!isOpen)}/>)
                    : (<ChevronDown className="size-4 ml-1 mt-2"onClick={() => setIsOpen(!isOpen)}/>)
                    }
                </div>
            </div>
            {isOpen && (
                <ul className="filters-list right-0 mt-2">
                    <li className={`filter-item flex items-center gap-3`}><CircleUserRound size={16}/><a href="/profile">Мій профіль</a></li>
                    <li className={`filter-item flex items-center gap-3`}><Settings size={16} />Налаштування</li>
                    <li className={`filter-item flex items-center gap-3`} onClick={handleLogOut}><LogOut color="red" size={16}/><span className="text-red-500">Вийти</span></li>
                </ul>
            )}
        </div>
    )
}