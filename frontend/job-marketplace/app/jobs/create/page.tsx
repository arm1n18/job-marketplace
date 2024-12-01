"use client";

import { categories, cities, employment } from "@/components/consts/filters-consts";
import { Container } from "@/components/Container";
import { useAuth } from "@/components/hook/AuthContext";
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
    const { email, id} = useAuth();
    const router = useRouter();

    const [minValue, setMinValue] = useState([0]);
    const [formdata, setFormdata] = useState({ title: '', category_name: '', subcategory_name: '',
    salary_from: 0, salary_to: 0, city: '', employment_name: '', experience: 0, description: '', requirements: '', offer: '', email: email ?? "", id: id ?? "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleFieldSubmit = (value: string | number, fieldName: string) => {
        setFormdata({ ...formdata, [fieldName]: value});
    };

    const handleGroupClick = (group: string, subgroup: string) => {
        setFormdata({ ...formdata, "category_name": group, "subcategory_name": subgroup});
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(formdata);

        await useFormSubmit({
            e, 
            url: "jobs/create",
            dataToSend: formdata,
            setLoading: () => {},
            validationZod: validationCreateJob,
            setErrors,
            router,
            message: "Вакансія успішно створена!",
            redirectURL: "jobs",
        });
    }

    return (
        <div className="mx-4 mb-24">
            <Container className="mt-12">
                <h1 className="text-title-dark my-12">Створення вакансії</h1>
                <div className="line-gray mb-12" />
                <form className="lg:w-fit" onSubmit={handleSubmit}>
                    <div className="flex flex-col lg:grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Посада</legend>
                        <div className="lg:w-[464px]">
                            <Input className={`w-full ${errors.title && "border-red-500"} bg-[#F9FAFB]`}
                                placeholder="Наприклад: JavaScript / Front-End розробник"
                                onChange={(e) => handleFieldSubmit(e.target.value, "title")}
                            />
                            {errors.title && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.title}</p>}
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Категорія</legend>
                        <div className="lg:w-[464px]">
                            <FilterDropDown
                                title={"JavaScript / Front-End"}
                                categories = {categories}
                                setSelectedGroup={handleGroupClick}
                            />
                            {errors.category_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.category_name}</p>}
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Ключові слова</legend>
                        <div className="lg:w-[464px]">
                            <Input className="w-full bg-[#F9FAFB]" placeholder="Наприклад: JavaScript / Front-End розробник" />
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Досвід роботи</legend>
                        <div className="lg:w-[464px]">
                            <div className="flex flex-col justify-between h-[36px]">
                            <p className="filters-text">{minValue[0]} {minValue[0] > 4 ? "років" : (minValue[0] > 1 ? "роки" : "рік")} досвіду</p>
                            <Slider
                                max={10}
                                step={0.5}
                                className="w-full"
                                onValueChange={(minValue) => {setMinValue(minValue), handleFieldSubmit(minValue[0], "experience")}}
                            />
                        </div>
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Заробітна плата</legend>
                        <div className="lg:w-[464px]">
                           <div className="flex max-md:justify-between md:gap-2 items-center">
                                <div className="flex">
                                        <div className="bg-gray-selected w-16 flex items-center justify-center rounded-l-lg filters-text">$</div>
                                        <Input className="w-28 bg-[#F9FAFB] rounded-l-none border-l-0"
                                            placeholder="1500"
                                            onChange={(e) => handleFieldSubmit(Number(e.target.value), "salary_from")}
                                        />
                                </div>
                                
                                <div className="w-3 bg-[#D0D5DD] h-[1px] top-1/2" />

                                <div className="flex">
                                        <div className="bg-gray-selected w-16 flex items-center justify-center rounded-l-lg filters-text">$</div>
                                        <Input className="w-28 bg-[#F9FAFB] rounded-l-none border-l-0"
                                            placeholder="2500"
                                            onChange={(e) => handleFieldSubmit(Number(e.target.value), "salary_to")}
                                        />
                                </div>
                           </div>
                        {errors.salary_to && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.salary_to}</p>}
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Місто</legend>
                        <div className="lg:w-[464px]">
                        <FilterDropDown
                                title={"Місто"}
                                categories = {cities}
                                setSelectedGroup={(e) => handleFieldSubmit(e, "city")}
                            />
                        </div>
                    </div>
                    <div className="grid mb-12 lg:mb-24 lg:grid-cols-2">
                        <legend className="text-common-dark max-w-32 max-lg:mb-2">Формат</legend>
                        <div className="lg:w-[464px]">
                            <CheckBoxesSection title={employment}
                                setSelectedFormat={(e) => handleFieldSubmit(e, "employment_name")}
                            />
                            {errors.employment_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.employment_name}</p>}
                        </div>
                    </div>

                    <div className="grid mb-12 lg:grid-cols-2">
                        <div className="flex flex-col lg:max-w-56">
                            <legend className="text-common-dark max-lg:mb-2">Опис</legend>
                            <p className="text-common-light mb-2">Опишіть вакансію, вказавши її основну суть та майбутні обов'язки кандидата.</p>
                        </div>
                        <div className="lg:w-[464px]">
                            <Textarea className={`${errors.description && "border-red-500"} bg-[#F9FAFB]`} placeholder="Опис"
                                onChange={(e) => handleFieldSubmit(e.target.value, "description")}
                            />
                            {errors.description && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.description}</p>}
                            <div className="filters-text">{formdata.description.length}/2000</div>
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <div className="flex flex-col lg:max-w-56">
                            <legend className="text-common-dark max-lg:mb-2">Вимоги</legend>
                            <p className="text-common-light mb-2">Опишіть основні вимоги до кандидата: якими технологіями він має володіти, які навички та досвід має мати.</p>
                        </div>
                        <div className="w-full lg:w-[464px]">
                            <Textarea className={`${errors.requirements && "border-red-500"} bg-[#F9FAFB] w-full`} placeholder="Вимоги"
                                onChange={(e) => handleFieldSubmit(e.target.value, "requirements")}
                            />
                            {errors.requirements && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.requirements}</p>}
                            <div className="filters-text">{formdata.requirements.length}/2000</div>
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <div className="flex flex-col lg:max-w-56">
                            <legend className="text-common-dark max-lg:mb-2">Пропонуємо</legend>
                            <p className="text-common-light mb-2">Опишіть, що ваша компанія пропонує своїм працівникам: медичну страховку, відпустки тощо.</p>
                        </div>
                        <div className="lg:w-[464px]">
                            <Textarea className={`${errors.offer && "border-red-500"} bg-[#F9FAFB]`} placeholder="Пропонуємо"
                                onChange={(e) => handleFieldSubmit(e.target.value, "offer")}
                            />
                            {errors.offer && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.offer}</p>}
                            <div className="filters-text">{formdata.offer.length}/1000</div>
                        </div>
                    </div>
                    <div className="flex lg:justify-end gap-4">
                        <Button variant="outline" onClick={() => router.back()}>
                                Скасувати
                        </Button>
                        <Button className="max-md:w-48" onClick={() => handleSubmit}>
                            Опублікувати вакансію
                        </Button>
                    </div>
                </form>
            </Container>
        </div>
    )
}