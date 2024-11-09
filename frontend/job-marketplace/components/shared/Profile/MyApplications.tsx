import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
    className?: string;
}

export const MyApplications: React.FC<Props> = ({ className }) => {
    return (
        

<div className="relative overflow-x-auto">
    <table className="w-full text-left rtl:text-right">
        <thead className="border-b  dark:border-gray-700">
            <tr>
                <th scope="col" className="px-6 py-3 text-common-dark">
                    Вакансія 
                </th>
                <th scope="col" className="px-6 py-3 text-common-dark">
                    Компанія
                </th>
                <th scope="col" className="px-6 py-3 text-common-dark">
                    Дата
                </th>
                <th scope="col" className="px-6 py-3 text-common-dark">
                    Статус
                </th>
                <th scope="col" className="px-6 py-3 text-common-dark">
                    
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-[#F7F7F8] border-b border-[#D0D5DD]">
                <td className="px-6 py-4">
                    Apple MacBook Pro 17"
                </td>
                <td className="px-6 py-4">
                    Silver
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4 text-common-blue flex gap-2 cursor-pointer">
                    Відкликати
                    <X className="w-4 h-4 mt-[6px]" color="#1C64EE"/>
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">
                    Apple MacBook Pro 17"
                </td>
                <td className="px-6 py-4">
                    White
                </td>
                <td className="px-6 py-4">
                    Laptop PC
                </td>
                <td className="px-6 py-4">
                    Laptop PC
                </td>
                <td className="px-6 py-4 text-common-blue flex gap-2 cursor-pointer">
                    Відкликати
                    <X className="w-4 h-4 mt-[6px]" color="#1C64EE"/>
                </td>
            </tr>
            <tr className="bg-[#F7F7F8] border-b border-[#D0D5DD]">
                <td className="px-6 py-4">
                    Apple MacBook Pro 17"
                </td>
                <td className="px-6 py-4">
                    Silver
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4 text-common-blue flex gap-2 cursor-pointer">
                    Відкликати
                    <X className="w-4 h-4 mt-[6px]" color="#1C64EE"/>
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">
                    Apple MacBook Pro 17"
                </td>
                <td className="px-6 py-4">
                    White
                </td>
                <td className="px-6 py-4">
                    Laptop PC
                </td>
                <td className="px-6 py-4">
                    Laptop PC
                </td>
                <td className="px-6 py-4 text-common-blue flex gap-2 cursor-pointer">
                    Відкликати
                    <X className="w-4 h-4 mt-[6px]" color="#1C64EE"/>
                </td>
            </tr>
        </tbody>
    </table>
</div>

    )
}