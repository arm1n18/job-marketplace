import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
    items: string[];
}

export const BreadCrumb: React.FC<Props> = ({items}) => {
    const pathname = usePathname();
    let currentPath = "";
    if (pathname.includes("/jobs")) currentPath = "jobs";
    if (pathname.includes("/candidates")) currentPath = "candidates";

    return (
        <ol className="flex gap-2 mb-6">
            <li className="text-common-blue"><Link href={`/${currentPath}`}><span>{currentPath == "jobs" ? "Вакансії" : "Кандидати"}</span></Link></li>
            {items[2] && <li className="text-common-blue"><Link href={`/company/${items[2]}`} className={`gap-2 flex`}><p className="text-common">/</p>{items[2]}</Link></li>}
            <li className="text-common-blue">
                <Link href={`/${currentPath}?category=${items[0]}`} className={`gap-2 flex`}><p className="text-common">/</p>{items[0]}</Link>
            </li>
            {items[1] && <li className="text-common-blue"><Link href={`/${currentPath}?category=${items[0]}&subcategory=${items[1]}`} className={`gap-2 flex`}><p className="text-common">/</p>{items[1]}</Link></li>}
        </ol>
    )
}