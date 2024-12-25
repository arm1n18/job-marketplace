'use client'

import { useAuth } from "@/components/hook/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoImgAvatars } from "@/components/ui/noImgAvatars";
import { ProfileType } from "@/types/profile.type";
import { CircleAlert, Upload } from "lucide-react";
import Image from 'next/image';
import { useState } from "react";

interface Props {
    data?: ProfileType;
    className?: string,
}

export const PersonalData: React.FC<Props> = ({ data }) => {
    const [errors] = useState<{ [key: string]: string }>({});
    const { avatarUrl, email } = useAuth();

    return (
        <div className="flex flex-col md:gap-12 md:flex-row">
            <div>
                <div className="w-full mb-6 lg:w-[464px]">
                    <label className="text-common-dark">Ім&apos;я та прізвище</label>
                    <Input className={`w-full ${errors.name && "border-red-500"} bg-[#F9FAFB] mt-2`}
                        placeholder="Микола Шевченко"
                        defaultValue={data?.name}
                        // onChange={(e) => handleTextSubmit(e.target.value, "name")}
                    />
                </div>
                <div className="w-full mb-6 lg:w-[464px]">
                    <label className="text-common-dark">Email</label>
                    <Input className={`w-full ${errors.email && "border-red-500"} bg-[#F9FAFB] mt-2`}
                        placeholder="Email"
                        defaultValue={email ?? ""}
                        // onChange={(e) => handleTextSubmit(e.target.value, "email")}
                    />
                </div>
                <div className="w-full mb-6 lg:w-[464px]">
                    <label className="text-common-dark">Телефон</label>
                    <Input className={`w-full ${errors.phone && "border-red-500"} bg-[#F9FAFB] mt-2`}
                        placeholder="+38 000 000 0000"
                        defaultValue={data?.phone}
                        // onChange={(e) => handleTextSubmit(e.target.value, "phone")}
                    />
                    {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                </div>
                <div className="w-full mt-12">
                    <div className="flex gap-8 lg:justify-between">
                        <span className="text-common-blue my-auto">Скасувати</span>
                        <Button className="w-full">
                            Завершити редагування
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-12 w-fit md:mt-0">
                {avatarUrl ? 
                (<Image src={avatarUrl} alt="avatar" className="rounded-full w-48 h-48"  width={1024} height={1024}/>) 
                : (<NoImgAvatars className="rounded-full w-48 h-48 text-6xl" name={String(email)}/>)}
                <div className="flex justify-center gap-3 items-center mt-6 text-[#1C64EE] font-medium cursor-pointer">
                    <Upload color="#1C64EE" size={16} strokeWidth={3}/>Завантажити фото
                </div>
            </div>
        </div>
    )
}