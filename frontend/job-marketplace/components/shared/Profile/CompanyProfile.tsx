'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileType } from "@/types/profile.type";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
    data?: ProfileType;
    setData: React.Dispatch<React.SetStateAction<any>>
    loading: boolean;
    className?: string;
}

export const CompanyProfile: React.FC<Props> = ({ setData, data }) => {
    const [errors] = useState<{ [key: string]: string }>({});

    const handleTextSubmit = (value: string, fieldName: string) => {
        setData({ ...data, [fieldName]: value });
    };

    return (
        <>
            {data == undefined && (
                <div className="max-md:w-full max-w-[976px] rounded-md bg-[#FEF3EA] border border-opacity-30 border-[#E7994B] p-2 mb-6">
                    <h1 className="text-center font-bold text-[#AE7236]">Профіль потрбіно заповнити.</h1>
                    <p className="text-center text-[#AE7236]">Перед початком пошуку ви повинні заповнити свій профіль, щоб він
                        відповідав усім умовам. Це можна зробити тут або <Link href={`/company/create`} className="underline underline-offset-4 italic font-semibold">за посиланням</Link>.</p>
                </div>
            )}
            <div className="flex flex-col lg:gap-12 lg:flex-row">
                <div>
                    {/* {Назва компанії} */}
                    <div className="w-full mb-6 lg:w-[464px]">
                        <h1 className="text-common-dark mb-2">Назва компанії</h1>
                        <Input className={`w-full ${errors.company_name && "border-red-500"} bg-[#F9FAFB]`}
                            placeholder="Наприклад: joobly.ua"
                            defaultValue={data?.company_name}
                            onChange={(e) => handleTextSubmit(e.target.value, "company_name")}
                        />
                        {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                    </div>
                    {/* {Сайт компанії} */}
                    <div className="w-full mb-6 lg:w-[464px]">
                        <h1 className="text-common-dark mb-2">Сайт компанії</h1>
                        <Input className={`w-full ${errors.website && "border-red-500"} bg-[#F9FAFB]`}
                            placeholder="Наприклад: https://www.joobly.ua/"
                            defaultValue={data?.website}
                            onChange={(e) => handleTextSubmit(e.target.value, "website")}
                        />
                        {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                    </div>
                    {/* {LinkedIn} */}
                    <div className="w-full mb-6 lg:w-[464px]">
                        <h1 className="text-common-dark mb-2">LinkedIn</h1>
                        <Input className={`w-full ${errors.linkedin && "border-red-500"} bg-[#F9FAFB]`}
                            placeholder="https://ua.linkedin.com/"
                            defaultValue={data?.linkedin}
                            onChange={(e) => handleTextSubmit(e.target.value, "linkedin")}
                        />
                        {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                    </div>
                    {/* {Facebook} */}
                    <div className="w-full max-lg:mb-6 lg:w-[464px]">
                        <h1 className="text-common-dark mb-2">Facebook</h1>
                        <Input className={`w-full ${errors.facebook && "border-red-500"} bg-[#F9FAFB]`}
                            placeholder="https://www.facebook.com/"
                            defaultValue={data?.facebook}
                            onChange={(e) => handleTextSubmit(e.target.value, "facebook")}
                        />
                        {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                    </div>
                </div>
                {/* {Про компанію} */}
                <div className="w-full lg:w-[464px] flex flex-col">
                    <h1 className="text-common-dark mb-2">Про компанію</h1>
                    <Textarea className={`${errors.about_us && "border-red-500"} bg-[#F9FAFB] flex-grow`} placeholder="Про компанію"
                    defaultValue={data?.about_us}
                    onChange={(e) => handleTextSubmit(e.target.value, "about_us")}
                    />
                    {errors.about_us && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.about_us}</p>}
                    {/* <div className="filters-text">/2000</div> */}
                    <div className="w-full mt-14">
                        <div className="gap-8 flex">
                            <span className="text-common-blue my-auto">Скасувати</span>
                            <Button className="w-full">
                                Завершити редагування
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}