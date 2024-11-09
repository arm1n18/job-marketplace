"use client";

import { categories, cities, employment } from "@/components/consts/filters-consts";
import { Container } from "@/components/Container";
import { useAuth } from "@/components/hook/isLoggedIn";
import { useFormSubmit } from "@/components/hook/useFormSubmit";
import { validationCreateJob } from "@/components/shared/validation-form";
import { Button } from "@/components/ui/button";
import { CheckBoxesSection } from "@/components/ui/checkBoxesSection";
import { FilterDropDown } from "@/components/ui/filterDropDown";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateJob() {
    const [minValue, setMinValue] = useState([0]);
    const [formData, setFormData] = useState({ title: '', category_name: '', subcategory_name: '',
    salary_from: 0, salary_to: 0, city: '', employment_name: '', experience: 0, description: '', requirements: '', offer: '' });
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
    };

    const handleExperienceSubmit = (value: number) => {
        setFormData({ ...formData, "experience": value});
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            email: email ?? '',
            id: id ?? '',
        };

        console.log(dataToSend);

        await useFormSubmit({
            e, 
            url: "jobs/create",
            dataToSend,
            setLoading: () => {},
            validationZod: validationCreateJob,
            setErrors,
            router,
            message: "Вакансія успішно створена!",
            redirectURL: "jobs",
        });
    }

    return (
        <div className="mx-2">
            <Container className="mt-12">
                <h1 className="text-title-dark my-12">Створення вакансії</h1>
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
                           <div className="flex gap-5 items-center">
                            <div className="flex">
                                    <div className="bg-gray-selected w-16 flex items-center justify-center rounded-l-md filters-text">$</div>
                                    <Input className="w-28 bg-[#F9FAFB] rounded-l-none border-l-0"
                                        placeholder="1500"
                                        onChange={(e) => handleTextSubmit(Number(e.target.value), "salary_from")}
                                    />
                            </div>
                                
                                <div className="w-3 bg-[#D0D5DD] h-[1px] top-1/2" />

                                <div className="flex">
                                        <div className="bg-gray-selected w-16 flex items-center justify-center rounded-l-md filters-text">$</div>
                                        <Input className="w-28 bg-[#F9FAFB] rounded-l-none border-l-0"
                                            placeholder="2500"
                                            onChange={(e) => handleTextSubmit(Number(e.target.value), "salary_to")}
                                        />
                                </div>
                           </div>
                        {errors.salary_to && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.salary_to}</p>}
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

                    <div className="grid grid-cols-2 mb-24">
                        <span className="text-common-dark max-w-32">Опис</span>
                        <div className="w-[464px]">
                            <Textarea className={`${errors.description && "border-red-500"} bg-[#F9FAFB]`} placeholder="Опис"
                                onChange={(e) => handleTextSubmit(e.target.value, "description")}
                            />
                            {errors.description && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.description}</p>}
                            <div className="filters-text">{formData.description.length}/2000</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-24">
                        <span className="text-common-dark max-w-32">Вимоги</span>
                        <div className="w-[464px]">
                            <Textarea className={`${errors.requirements && "border-red-500"} bg-[#F9FAFB]`} placeholder="Вимоги"
                                onChange={(e) => handleTextSubmit(e.target.value, "requirements")}
                            />
                            {errors.requirements && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.requirements}</p>}
                            <div className="filters-text">{formData.requirements.length}/2000</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mb-12">
                        <span className="text-common-dark max-w-32">Пропонуємо</span>
                        <div className="w-[464px]">
                            <Textarea className={`${errors.offer && "border-red-500"} bg-[#F9FAFB]`} placeholder="Пропонуємо"
                                onChange={(e) => handleTextSubmit(e.target.value, "offer")}
                            />
                            {errors.offer && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.offer}</p>}
                            <div className="filters-text">{formData.offer.length}/1000</div>
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