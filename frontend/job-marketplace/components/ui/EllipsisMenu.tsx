import { cn } from "@/lib";
import { copyURL } from "@/lib/utils/copyURL";
import { EllipsisVertical, PencilLine, Share2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation";

interface Props {
    isOpen: boolean;
    openedAlert: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenedAlert: React.Dispatch<React.SetStateAction<boolean>>;
    openedRef: React.RefObject<HTMLDivElement>;
    data: any;
    url: string;
    className?: string;
}

export const EllipsisMenu: React.FC<Props> = ({data, isOpen, setIsOpen, openedRef, openedAlert, setOpenedAlert, url, className}) => {
    const router = useRouter();
    return (
        <div className={cn("text-common", className)} onClick={() =>setIsOpen(!isOpen)} ref={openedRef}>
            <EllipsisVertical className="text-common hover:cursor-pointer" />
            {isOpen && (
            <ul className="filters-list right-10 mt-2">
                <li className={`filter-item flex items-center gap-3`} onClick={() => copyURL(window.location.href)}><Share2 size={16}/>Поділитись</li>
                <li className={`filter-item flex items-center gap-3`} onClick={() => router.push(`/${url}/edit/${data}`)}><PencilLine size={16}/>Відредагувати</li>
                <div className="line-gray" />
                <li className={`filter-item flex items-center gap-3`} onClick={() => setOpenedAlert(!openedAlert)}><Trash2 size={16}/>Видалити</li>
            </ul>
            )}
        </div>
    )
}