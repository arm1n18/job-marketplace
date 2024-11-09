"use client";

import { Container } from "@/components/Container";
import { useAuth } from "@/components/hook/isLoggedIn";
import { sendForm } from "@/components/hook/sendForm";
import { validationCreateCompany } from "@/components/shared/validation-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Asterisk, CircleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ZodIssue } from "zod";

export default function CreateJob() {
    const [formData, setFormData] = useState({
        recruiter_name: '',
        company_name: '',
        about_us: '',
        web_site: '',
        linkedin: '',
        facebook: '',
        phone: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();
    const { id, setAvatarUrl } = useAuth();

    const handleTextSubmit = (value: string, fieldName: string) => {
        setFormData({ ...formData, [fieldName]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            setAvatarFile(files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result  = validationCreateCompany.safeParse(formData);
        if(!result.success) {
            const formErrors: { [key: string]: string} = {};
            result.error.errors.forEach((error: ZodIssue) => {
                formErrors[error.path[0] as string] = error.message;
            })
            setErrors(formErrors);
            return;
        }

        const formDataSend = new FormData();
        formDataSend.append('recruiter_id', id?.toString() ?? '');
        if (avatarFile) formDataSend.append('avatar', avatarFile);
        formDataSend.append('recruiter_name', formData.recruiter_name);
        formDataSend.append('company_name', formData.company_name);
        formDataSend.append('about_us', formData.about_us);
        formDataSend.append('web_site', formData.web_site);
        formDataSend.append('linkedin', formData.linkedin);
        formDataSend.append('facebook', formData.facebook);
        formDataSend.append('phone', formData.phone);
        

        const response = await sendForm({url: 'company/create', data: formDataSend, setLoading: () => {}, router, message: 'Профіль компанії створено успішно', redirectURL: 'jobs/create'});
        response?.data?.avatar_url ? setAvatarUrl(response.data.avatar_url) : null
    };

    return (
        <div className="mx-2">
            <Container className="mt-12">
                <h1 className="text-title-dark my-12">Оформелення профілю</h1>
                <div className="line-gray mb-12" />
                <form className="w-fit" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark">Ім’я та прізвище рекрутера</span>
                        <div className="w-[464px]">
                            <Input className={`w-full ${errors.recruiter_name && "border-red-500"} bg-[#F9FAFB]`}
                                placeholder="Микола Шевченко"
                                onChange={(e) => handleTextSubmit(e.target.value, "recruiter_name")}
                            />
                            {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark">Назва команії</span>
                        <div className="w-[464px]">
                            <Input className={`w-full ${errors.company_name && "border-red-500"} bg-[#F9FAFB]`}
                                placeholder="Наприклад: joobly.ua"
                                onChange={(e) => handleTextSubmit(e.target.value, "company_name")}
                            />
                            {errors.company_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.company_name}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark">Телефон</span>
                        <div className="w-[464px]">
                            <Input className={`w-full ${errors.phone && "border-red-500"} bg-[#F9FAFB]`}
                                placeholder="+38 000 000 0000"
                                onChange={(e) => handleTextSubmit(e.target.value, "phone")}
                            />
                            {errors.phone && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.phone}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <div className="flex gap-1">
                            <span className="text-common-dark">Аватар</span>
                            <Asterisk color="#1C64EE" size={14}/>
                        </div>
                        <div className="w-[464px] gap-5 flex">
                            <Input className="w-full bg-[#F9FAFB] text-[#D0D5DD]"  type="file" 
                                placeholder="https://ua.linkedin.com/" // проверить
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <div className="flex gap-1">
                            <span className="text-common-dark">Сайт компанії</span>
                            <Asterisk color="#1C64EE" size={14}/>
                        </div>
                        <div className="w-[464px]">
                            <Input className={`w-full ${errors.web_site && formData.web_site != "" && "border-red-500"} bg-[#F9FAFB]`}
                                placeholder="Наприклад: https://www.joobly.ua/"
                                onChange={(e) => handleTextSubmit(e.target.value, "web_site")}
                            />
                            {errors.web_site && formData.web_site != "" && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.web_site}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <div className="flex gap-1">
                            <span className="text-common-dark">LinkedIn</span>
                            <Asterisk color="#1C64EE" size={14}/>
                        </div>
                        <div className="w-[464px]">
                            <Input className={`w-full ${errors.linkedin && formData.linkedin != "" &&  "border-red-500"} bg-[#F9FAFB]`}
                                placeholder="https://ua.linkedin.com/"
                                onChange={(e) => handleTextSubmit(e.target.value, "linkedin")}
                            />
                            {errors.linkedin && formData.linkedin != "" && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.linkedin}</p>}
                        </div>
                    </div><div className="grid grid-cols-2 mb-24">
                        <div className="flex gap-1">
                            <span className="text-common-dark">Facebook</span>
                            <Asterisk color="#1C64EE" size={14}/>
                        </div>
                        <div className="w-[464px]">
                            <Input className={`w-full ${errors.facebook && formData.facebook != "" && "border-red-500"} bg-[#F9FAFB]`}
                                placeholder="https://www.facebook.com/"
                                onChange={(e) => handleTextSubmit(e.target.value, "facebook")}
                            />
                            {errors.facebook && formData.facebook != "" && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.facebook}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark max-w-32">Про компанію</span>
                        <div className="w-[464px]">
                            <Textarea className={`${errors.about_us && "border-red-500"} bg-[#F9FAFB]`} placeholder="Про компанію"
                            onChange={(e) => handleTextSubmit(e.target.value, "about_us")}
                            />
                            {errors.about_us && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.about_us}</p>}
                            <div className="filters-text">{formData.about_us.length}/2000</div>
                        </div>
                    </div>
                    
                    <div className="w-full">
                        <div className="flex justify-end gap-6 mr-9">
                            <Button asChild
                                    variant="outline">
                                    <Link href="/login">Скасувати публікацію</Link>
                            </Button>
                            <Button onClick={() => handleSubmit}>Завершити публікацію</Button>
                        </div>
                    </div>
                </form>
            </Container>
        </div>
    )
}