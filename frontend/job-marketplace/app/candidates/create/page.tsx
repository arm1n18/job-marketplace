"use client";

import { categories, cities, employment } from "@/components/consts/filters-consts";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { CheckBoxesSection } from "@/components/ui/checkBoxesSection";
import { FilterDropDown } from "@/components/ui/filterDropDown";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { validationCreateResume } from "@/components/shared/validation-form";
import { CircleAlert } from "lucide-react";
import { useFormSubmit } from "@/components/hook/useFormSubmit";
import { useAuth } from "@/components/hook/isLoggedIn";
import { useRouter } from "next/navigation";

export default function CreateJob() {
    const [minValue, setMinValue] = useState([0]);
    const [formData, setFormData] = useState({ title: '', category_name: '', subcategory_name: '',
    salary: 0, city: '', employment_name: '', experience: 0, work_experience: '', achievements: '' });
    // const [errors, setErrors] = useState<{ title?: string; work_experience?: string; achievements?: string , salary?: string, employment_name?: string, category_name?: string}>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    const { email, id} = useAuth();

    const handleTextSubmit = (value: string | number, fieldName: string) => {
        setFormData({ ...formData, [fieldName]: value});
    };

    const handleCheckBoxClick = (title: string) => {
        setFormData({ ...formData, "employment_name": title});
        console.log(`Checkbox clicked: ${title}`);
    };

    const handleGroupClick = (group: string, subgroup: string) => {
        setFormData({ ...formData, "category_name": group, "subcategory_name": subgroup});
    };

    const handleCityClick = (title: string) => {
        setFormData({ ...formData, "city": title});
        console.log(`Group clicked: ${title}`);
    };

    const handleExperienceSubmit = (value: number) => {
        setFormData({ ...formData, "experience": value});
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {

        const dataToSend = {
            ...formData,
            email: email ?? '',
            id: id ?? '',
        };

        e.preventDefault();
        await useFormSubmit({
            e, 
            url: "candidates/create",
            dataToSend,
            setLoading: () => {},
            validationZod: validationCreateResume,
            setErrors,
            router,
            message: "Резюме успішно створено!",
            redirectURL: "candidates",
        });
    }

    return (
        <div className="mx-2">
            <Container className="mt-12">
                <h1 className="text-title-dark my-12">Оформелення профілю</h1>
                <div className="line-gray mb-12" />
                <form className="w-fit" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark">Позиція</span>
                        <div className="w-[464px]">
                            <Input className={`w-full ${errors.title && "border-red-500"} bg-[#F9FAFB]`}
                                placeholder="Наприклад: JavaScript / Front-End розробник"
                                onChange={(e) => handleTextSubmit(e.target.value, "title")}
                            />
                            {errors.title && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.title}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark">Категорія</span>
                        <div className="w-[464px]">
                            <FilterDropDown
                                title={"JavaScript / Front-End"}
                                categories = {categories}
                                setSelectedGroup={handleGroupClick}
                            />
                            {errors.category_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.category_name}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark">Ключові слова</span>
                        <div className="w-[464px]">
                            <Input className="w-full bg-[#F9FAFB]" placeholder="Наприклад: JavaScript / Front-End розробник" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark">Досвід роботи</span><div className="w-[464px]">
                            <div className="w-[464px] flex flex-col justify-between h-[36px]">
                            <p className="filters-text">{minValue[0]} {minValue[0] > 4 ? "років" : (minValue[0] > 1 ? "роки" : "рік")} досвіду</p>
                            <Slider
                                    max={10}
                                    step={0.5}
                                    className="w-full"
                                    onValueChange={(minValue) => {setMinValue(minValue), handleExperienceSubmit(minValue[0])}}
                                />
                        </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark">Заробітня плата</span>
                        <div className="w-[464px]">
                            <div className="flex">
                                <div className={`${errors.salary ? "bg-error" : "bg-gray-selected"} w-16 flex items-center justify-center rounded-l-md filters-text`}>$</div>
                                <Input className={`w-28 bg-[#F9FAFB] rounded-l-none border-l-0 ${errors.salary && "bg-error"}`}
                                    placeholder="1500"
                                    onChange={(e) => handleTextSubmit(Number(e.target.value), "salary")}
                                />
                            </div>
                            {errors.salary && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.salary}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark">Місто</span>
                        <div className="w-[464px]">
                        <FilterDropDown
                                title={"Місто"}
                                categories = {cities}
                                setSelectedGroup={handleCityClick}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-24">
                        <span className="text-common-dark max-w-32">Формат</span>
                        <div className="w-[464px]">
                            <CheckBoxesSection title={employment}
                                setSelectedFormat={handleCheckBoxClick}
                            />
                            {errors.employment_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.employment_name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark max-w-32">Досвід роботи</span>
                        <div className="w-[464px]">
                            <Textarea className={`${errors.work_experience && "border-red-500"} bg-[#F9FAFB]`} placeholder="Досвід роботи"
                            onChange={(e) => handleTextSubmit(e.target.value, "work_experience")}
                            />
                            {errors.work_experience && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.work_experience}</p>}
                            <div className="filters-text">{formData.work_experience.length}/2000</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark max-w-32">Досягнення</span>
                        <div className="w-[464px]">
                            <Textarea className="bg-[#F9FAFB]" placeholder="Досягнення"
                                onChange={(e) => handleTextSubmit(e.target.value, "achievements")}
                            />
                            {errors.achievements && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.achievements}</p>}
                            <div className="filters-text">{formData.achievements.length}/2000</div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-end gap-6 mr-9">
                            <Button variant="outline">
                                    Скасувати публікацію
                            </Button>
                            <Button  onClick={() => handleSubmit}>
                                Завершити публікацію
                            </Button>
                        </div>
                    </div>
                </form>
            </Container>
        </div>
    )
}
