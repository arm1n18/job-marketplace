import { useEffect, useRef, useState } from "react";
import { NoImgAvatars } from "./noImgAvatars";
import { ChevronDown, ChevronUp, CircleUserRound, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { LogOutUser } from "@/lib/utils/LogOutUser";
import { fetchAvatar } from "../hook/fetchAvatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "../hook/AuthContext";
import { useWindowWidth } from "../hook/useWindowWidth";
import { useOpenedRef } from "../hook/useOpenedRef";

interface Props {
    className?: string;
  }

export const ProfileButton: React.FC<Props> = (className) => {
    const [isOpen, setIsOpen] = useState(false);
    const screenWidth = useWindowWidth();
    const openedRef = useRef<HTMLDivElement>(null);
    const {email, setLoggedIn, avatarUrl, setAvatarUrl, role} = useAuth();
    

    useEffect(() => {
        if(screenWidth < 768) setIsOpen(false);
    }, [screenWidth])


    useEffect(() => {
        fetchAvatar(setAvatarUrl, role);
    }, [])

    useOpenedRef({isOpen: isOpen, setIsOpen: setIsOpen, openedRef});

    const router = useRouter();

    const handleLogOut = async () => {
        try {
            localStorage.clear();
            setLoggedIn(false);
            setAvatarUrl(null);
            router.refresh()
            await LogOutUser();
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={cn("relative", className)} ref={openedRef}>
            <div>
                <div className="flex gap-4 cursor-pointer">
                    <Link href="/profile">
                        {
                            avatarUrl && avatarUrl.length > 0 ?
                            (<img src={avatarUrl} alt="avatar" className="rounded-full w-8 h-8" />) 
                            : (<NoImgAvatars className="rounded-full w-8 h-8 text-[12px]" name={String(email)}/>)
                        }
                    </Link>
                    <span className="block max-md:hidden">
                        { isOpen ? 
                            (<ChevronUp className="size-4 ml-1 mt-2" onClick={() => setIsOpen(!isOpen)}/>)
                        : (<ChevronDown className="size-4 ml-1 mt-2"onClick={() => setIsOpen(!isOpen)}/>)
                        }
                    </span>
                </div>
            </div>
            {isOpen && (
                <ul className="filters-list right-0 mt-2">
                    <li className={`filter-item flex items-center gap-3`}><CircleUserRound size={16}/><a href="/profile">Мій профіль</a></li>
                    <li className={`filter-item flex items-center gap-3`}><Settings size={16} />Налаштування</li>
                    <li className={`filter-item flex items-center gap-3`} onClick={handleLogOut}><LogOut size={16}/><span>Вийти</span></li>
                </ul>
            )}
        </div>
    )
}