import { useAuth } from "@/components/hook/isLoggedIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoImgAvatars } from "@/components/ui/noImgAvatars";
import { Textarea } from "@/components/ui/textarea";
import { CircleAlert, Upload } from "lucide-react"
import { useState } from "react";

interface Props {
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MyProfile: React.FC<Props> = ({ className, onChange }) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { avatarUrl, email } = useAuth();

    return (
        <div className="flex justify-between">
            <div>
                {avatarUrl ? 
                (<img src={avatarUrl} alt="avatar" className="rounded-full w-48 h-48" />) 
                : (<NoImgAvatars className="rounded-full w-8 h-8 text-[12px]" name={String(email)}/>)}
                <div className="flex justify-center gap-3 items-center mt-6 text-[#1C64EE] font-medium cursor-pointer">
                    <Upload color="#1C64EE" size={16} strokeWidth={3}/>Завантажити фото
                </div>
            </div>
            <div>
                <div className="w-[464px] mb-6">
                    <h1 className="text-common-dark mb-2">Ім'я та прізвище</h1>
                    <Input className={`w-full ${errors.recruiter_name && "border-red-500"} bg-[#F9FAFB]`}
                        placeholder="Микола Шевченко"
                        // onChange={(e) => handleTextSubmit(e.target.value, "recruiter_name")}
                    />
                    {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                </div>
                <div className="w-[464px] mb-6">
                    <h1 className="text-common-dark mb-2">Телефон</h1>
                    <Input className={`w-full ${errors.recruiter_name && "border-red-500"} bg-[#F9FAFB]`}
                        placeholder="+38 000 000 0000"
                        // onChange={(e) => handleTextSubmit(e.target.value, "recruiter_name")}
                    />
                    {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                </div>
                <div className="w-[464px] mb-6">
                    <h1 className="text-common-dark mb-2">Назва компанії</h1>
                    <Input className={`w-full ${errors.recruiter_name && "border-red-500"} bg-[#F9FAFB]`}
                        placeholder="Наприклад: joobly.ua"
                        // onChange={(e) => handleTextSubmit(e.target.value, "recruiter_name")}
                    />
                    {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                </div>
                <div className="w-[464px] mb-6">
                    <h1 className="text-common-dark mb-2">Сайт компанії</h1>
                    <Input className={`w-full ${errors.recruiter_name && "border-red-500"} bg-[#F9FAFB]`}
                        placeholder="Наприклад: https://www.joobly.ua/"
                        // onChange={(e) => handleTextSubmit(e.target.value, "recruiter_name")}
                    />
                    {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                </div>
                <div className="w-[464px] mb-6">
                    <h1 className="text-common-dark mb-2">LinkedIn</h1>
                    <Input className={`w-full ${errors.recruiter_name && "border-red-500"} bg-[#F9FAFB]`}
                        placeholder="https://ua.linkedin.com/"
                        // onChange={(e) => handleTextSubmit(e.target.value, "recruiter_name")}
                    />
                    {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                </div>
                <div className="w-[464px]">
                    <h1 className="text-common-dark mb-2">Facebook</h1>
                    <Input className={`w-full ${errors.recruiter_name && "border-red-500"} bg-[#F9FAFB]`}
                        placeholder="https://www.facebook.com/"
                        // onChange={(e) => handleTextSubmit(e.target.value, "recruiter_name")}
                    />
                    {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                </div>
            </div>
            <div className="w-[464px] flex flex-col">
                <h1 className="text-common-dark mb-2">Про компанію</h1>
                <Textarea className={`${errors.about_us && "border-red-500"} bg-[#F9FAFB] flex-grow`} placeholder="Про компанію"
                // onChange={(e) => handleTextSubmit(e.target.value, "about_us")}
                />
                {errors.about_us && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.about_us}</p>}
                {/* <div className="filters-text">/2000</div> */}
                <div className="w-full mt-14">
                    <div className="flex justify-between">
                        <Button variant="outline">
                                Скасувати редагування
                        </Button>
                        <Button>
                            Завершити редагування
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}