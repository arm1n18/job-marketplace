import { useAuth } from "@/components/hook/AuthContext";
import { Button } from "@/components/ui/button";
import { NoImgAvatars } from "@/components/ui/noImgAvatars";
import { LogOut } from "lucide-react";
import Link from "next/link";

interface Props {
    openedMobileMenu: boolean,
    setOpenedMobileMenu: React.Dispatch<React.SetStateAction<boolean>>
    className?: string
}

export const MobileUpperMenu: React.FC<Props> = ({ openedMobileMenu, setOpenedMobileMenu }) => {
    const {role, avatarUrl, email} = useAuth();    
    return (
        <>
            <div className={`my-auto bg-white w-full md:hidden py-4`}>
                <Link href="/profile" className="flex gap-2 mx-4 mb-2">
                    {
                        avatarUrl ? 
                        (<img src={avatarUrl} alt="avatar" className="rounded-full w-12 h-12" />) 
                        : (<NoImgAvatars className="rounded-full w-12 h-12 text-2xl" name={String(email)}/>)
                    }
                    <div className="flex flex-col my-auto overflow-hidden">
                        <p className="text-md font-bold truncate">{email}</p>
                        <span className="text-common">Мій профіль</span>
                    </div>
                </Link>

                <ul className="">
                    <li className="hover:bg-[#F7F7F8] filters-block-mobile py-2 px-4" onClick={() => setOpenedMobileMenu(!openedMobileMenu)}><Link href="/jobs">Пошук вакансій</Link></li>
                    <li className="hover:bg-[#F7F7F8] filters-block-mobile py-2 px-4" onClick={() => setOpenedMobileMenu(!openedMobileMenu)}><Link href="/candidates">Пошук кандидатів</Link></li>
                    <li className="hover:bg-[#F7F7F8] filters-block-mobile py-2 px-4" onClick={() => setOpenedMobileMenu(!openedMobileMenu)}><Link href="/inbox">Відгуки</Link></li>
                    {role === "RECRUITER" &&
                        <li className="hover:bg-[#F7F7F8] filters-block-mobile py-2 px-4" onClick={() => setOpenedMobileMenu(!openedMobileMenu)}><Link href="/jobs/create">Створити вакансію</Link></li>
                    }
                    {
                        role === "CANDIDATE" &&
                        <li className="hover:bg-[#F7F7F8] filters-block-mobile py-2 px-4" onClick={() => setOpenedMobileMenu(!openedMobileMenu)}><Link href="/candidates/create">Створити резюме</Link></li>
                    }
                </ul>
            
            <div className="flex flex-col px-4 my-4">
                <Button variant={"outline"} className="gap-4"><LogOut size={16}/>Вийти</Button>
            </div>
            {/* <div className="flex gap-2 px-4 my-4 text-common items-center">
                <LogOut size={16}/>Вийти
            </div> */}
            </div>

        </>
    )
}