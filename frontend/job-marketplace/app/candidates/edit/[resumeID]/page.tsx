"use client";

import { categories, cities, employment } from "@/components/consts/filters-consts";
import { Container } from "@/components/Container";
import { Button, Input, Textarea, Slider, CheckBoxesSection, FilterDropDown, LoadingSVG, KeywordsInput } from "@/components/ui";
import { SetStateAction, useEffect, useState } from "react";
import { validationCreateResume } from "@/components/shared/validation-form";
import { Asterisk, CircleAlert } from "lucide-react";
import { useAuth, useFormUpdate } from "@/components/hook";
import { useRouter } from "next/navigation";
import { ResumeCreate } from "@/types";
import ResumeService from "@/services/ResumeService";

export default function EditJob({ params: { resumeID } }: { params: { resumeID: number } }) {
    const { email, id} = useAuth();
    const router = useRouter();
    
    const [formData, setFormData] = useState<ResumeCreate>({ title: '', category_name: '', subcategory_name: '', keywords: [],
    salary: 0, city_name: '', employment_name: '', experience: 0, work_experience: '', achievements: '', email: email!, id: id! });
    const [initialData, setInitialData] = useState<ResumeCreate>({});
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    useEffect(() => {
        const getJobByID = new ResumeService({url: `candidates/${resumeID}`, setLoading, setData: (data: SetStateAction<ResumeCreate>) => {setFormData(data); setInitialData(data)}});
        getJobByID.fetchResumeByID();
    }, [resumeID]);
    // was [id]

    const handleChange = (fields: Partial<ResumeCreate>) => {
        console.log(formData);
        setFormData({...formData, ...fields});
    };

    const HandleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await useFormUpdate({
            e, 
            url: `candidates/${resumeID}`,
            dataToSend: formData as { [key: string]: string | number | File; },
            setLoading: () => {},
            validationZod: validationCreateResume,
            setErrors,
            router,
            message: "Резюме успішно оновлено!",
            redirectURL: `candidates/${resumeID}`,
            isDataChanged: initialData !== formData
        });
    }

    return (
        <div className="mx-4 mb-24">
            <Container className="mt-12">
                <h1 className="text-title-dark my-12">Оформелення профілю</h1>
                <div className="line-gray mb-12" />
                <form className="lg:w-fit" onSubmit={HandleSubmit}>
                    {/* {Посада} */}
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Посада</legend>
                        <div className="lg:w-[464px]">
                            <Input className={`w-full ${errors.title && "border-red-500"} bg-[#F9FAFB]`}
                                placeholder="Наприклад: JavaScript / Front-End розробник"
                                onChange={(e) => handleChange({title: e.target.value})}
                                defaultValue={formData?.title}
                                disabled={loading}
                            />
                            {errors.title && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.title}</p>}
                        </div>
                    </div>
                    {/* {Категорія} */}
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Категорія</legend>
                        <div className="lg:w-[464px]">
                            <FilterDropDown
                                title={"JavaScript / Front-End"}
                                categories = {categories}
                                disabled={loading}
                                defaultValue={String(formData?.category_name)}
                                defaultSubValue={String(formData?.subcategory_name)}
                                setSelectedGroup={(group, subgroup) => handleChange({ category_name: group, subcategory_name: subgroup })}
                            />
                            {errors.category_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.category_name}</p>}
                        </div>
                    </div>
                    {/* {Ключові слова - не працює} */}
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Ключові слова</legend>
                        <div className="lg:w-[464px]">
                            <KeywordsInput
                                setKeywords={(keywords) => handleChange({keywords})}
                                keywords={formData.keywords}
                                defaultValue={formData.keywords}
                                disabled={loading}
                            />
                            {errors.keywords && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.keywords}</p>}
                        </div>
                    </div>
                    {/* {Досвід роботи} */}
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Досвід роботи</legend><div className="lg:w-[464px]">
                            <div className="lg:w-[464px] flex flex-col justify-between h-[36px]">
                            <p className="filters-text">{formData?.experience || 0} {Number(formData?.experience) > 4 || Number(formData?.experience) == 0 ? "років" : (Number(formData?.experience) > 1 ? "роки" : "рік")} досвіду</p>
                            <Slider
                                value={[Number(formData?.experience) || 0] }    
                                disabled={loading} 
                                defaultValue={[0]}  
                                max={10}
                                step={0.5}
                                className="w-full"
                                onValueChange={(minValue) => {handleChange({experience: minValue[0]})}}
                            />
                        </div>
                        </div>
                    </div>
                    {/* {Заробітна плата} */}
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Заробітна плата</legend>
                        <div className="lg:w-[464px]">
                            <div className="flex">
                                <div className={`${errors.salary ? "bg-error" : "bg-gray-selected"} w-16 flex items-center justify-center rounded-l-md filters-text`}>$</div>
                                <Input className={`w-28 bg-[#F9FAFB] rounded-l-none border-l-0 ${errors.salary && "bg-error"}`}
                                    placeholder="1500"
                                    disabled={loading}
                                    defaultValue={formData?.salary != 0 ? formData?.salary : ""}
                                    onChange={(e) => handleChange({salary: Number(e.target.value)})}
                                />
                                <p className="text-common-dark my-auto ml-2">/ на місяць</p>
                            </div>
                            {errors.salary && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.salary}</p>}
                        </div>
                    </div>
                    {/* {Місто} */}
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Місто</legend>
                        <div className="lg:w-[464px]">
                        <FilterDropDown
                                title={"Місто"}
                                categories = {cities}
                                setSelectedGroup={(e) => handleChange({city_name: e})}
                                defaultValue={String(formData?.city_name)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    {/* {Посада} */}
                    <div className="grid mb-12 lg:mb-24 lg:grid-cols-2">
                        <legend className="text-common-dark max-w-32 max-lg:mb-2">Формат</legend>
                        <div className="lg:lg:w-[464px]">
                            <CheckBoxesSection title={employment}
                                defaultValue={String(formData?.employment_name)}
                                setSelectedFormat={(e) => handleChange({employment_name: e})}
                            />
                            {errors.employment_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.employment_name}</p>}
                        </div>
                    </div>
                    {/* {Формат} */}
                    <div className="grid mb-12 lg:grid-cols-2">
                        <div className="flex flex-col lg:max-w-56">
                            <legend className="text-common-dark max-lg:mb-2">Досвід роботи</legend>
                            <p className="text-common-light mb-2">Опишіть свої досвід роботи на минулій позиції, технології,
                                які ви використовували та над чим працювали.</p>
                        </div>
                        <div className="lg:w-[464px]">
                            <Textarea className={`${errors.work_experience && "border-red-500"} bg-[#F9FAFB]`} placeholder="Досвід роботи"
                                disabled={loading}
                                defaultValue={formData?.work_experience ?? ""}
                                onChange={(e) => handleChange({work_experience: e.target.value})}
                            />
                            {errors.work_experience && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.work_experience}</p>}
                            <div className="filters-text">{(formData.work_experience ?? "").length}/2000</div>
                        </div>
                    </div>
                    {/* {Досягнення} */}
                    <div className="grid mb-12 lg:grid-cols-2">
                        <div className="flex flex-col lg:max-w-56">
                            <div className="flex gap-1">
                                <legend className="text-common-dark max-lg:mb-2">Досягнення</legend>
                                <Asterisk color="#1C64EE" size={12}/>
                            </div>
                            <p className="text-common-light mb-2">Опишіть свої досягнення на минулій роботі або навички якими ви володіїте найбільше.</p>
                        </div>
                        <div className="lg:w-[464px]">
                            <Textarea className="bg-[#F9FAFB]" placeholder="Досягнення"
                                disabled={loading}
                                defaultValue={formData?.achievements ?? ""}
                                onChange={(e) => handleChange({achievements: e.target.value})}
                            />
                            {errors.achievements && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.achievements}</p>}
                            <div className="filters-text">{(formData.achievements ?? "").length}/2000</div>
                        </div>
                    </div>
                    {/* {Кнопки} */}
                    <div className="flex lg:justify-end gap-4">
                        <Button variant="outline" onClick={() => router.back()}>
                                Скасувати
                        </Button>
                        <Button className="max-md:w-48" onClick={() => HandleSubmit} disabled={loading}>
                            {loading ? <div className="flex gap-2"><LoadingSVG /> Застосування змін</div> : "Застосувати зміни"}
                        </Button>
                    </div>
                </form>
            </Container>
        </div>
    )
}
