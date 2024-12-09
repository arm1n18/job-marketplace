"use client";

import { categories, cities, employment } from "@/components/consts/filters-consts";
import { Container } from "@/components/Container";
import { useAuth, useFormSubmit } from "@/components/hook";
import { validationCreateJob } from "@/components/shared/validation-form";
import { FilterDropDown, CheckBoxesSection, Button, Input, Slider, Textarea } from "@/components/ui";
import { JobCreate } from "@/types";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function CreateJob() {
    const { email, id} = useAuth();
    const router = useRouter();

    const [minValue, setMinValue] = useState([0]);
    const [formdata, setFormdata] = useState<JobCreate>({ title: '', category_name: '', subcategory_name: '',
    salary_from: 0, salary_to: 0, city: '', employment_name: '', experience: 0, description: '', requirements: '', offer: '', email: email!, id: id!});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (fields: Partial<JobCreate>) => {
        console.log(formdata);
        setFormdata({...formdata, ...fields});
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(formdata);

        await useFormSubmit({
            e, 
            url: "jobs/",
            dataToSend: formdata as { [key: string]: string | number | File; },
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
                                onChange={(e) => handleChange({title: e.target.value})}
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
                                setSelectedGroup={(group, subgroup) => handleChange({ category_name: group, subcategory_name: subgroup })}
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
                                onValueChange={(minValue) => {setMinValue(minValue), handleChange({experience: minValue[0]})}}
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
                                            onChange={(e) => handleChange({salary_from: Number(e.target.value)})}
                                        />
                                </div>
                                
                                <div className="w-3 bg-[#D0D5DD] h-[1px] top-1/2" />

                                <div className="flex">
                                        <div className="bg-gray-selected w-16 flex items-center justify-center rounded-l-lg filters-text">$</div>
                                        <Input className="w-28 bg-[#F9FAFB] rounded-l-none border-l-0"
                                            placeholder="2500"
                                            onChange={(e) => handleChange({salary_to: Number(e.target.value)})}
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
                                setSelectedGroup={(e) => handleChange({city: e})}
                            />
                        </div>
                    </div>
                    <div className="grid mb-12 lg:mb-24 lg:grid-cols-2">
                        <legend className="text-common-dark max-w-32 max-lg:mb-2">Формат</legend>
                        <div className="lg:w-[464px]">
                            <CheckBoxesSection title={employment}
                                setSelectedFormat={(e) => handleChange({employment_name: e})}
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
                                onChange={(e) => handleChange({description: e.target.value})}
                            />
                            {errors.description && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.description}</p>}
                            <div className="filters-text">{(formdata.description ?? "").length}/2000</div>
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <div className="flex flex-col lg:max-w-56">
                            <legend className="text-common-dark max-lg:mb-2">Вимоги</legend>
                            <p className="text-common-light mb-2">Опишіть основні вимоги до кандидата: якими технологіями він має володіти, які навички та досвід має мати.</p>
                        </div>
                        <div className="w-full lg:w-[464px]">
                            <Textarea className={`${errors.requirements && "border-red-500"} bg-[#F9FAFB] w-full`} placeholder="Вимоги"
                                onChange={(e) => handleChange({requirements: e.target.value})}
                            />
                            {errors.requirements && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.requirements}</p>}
                            <div className="filters-text">{(formdata.requirements ?? "").length}/2000</div>
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <div className="flex flex-col lg:max-w-56">
                            <legend className="text-common-dark max-lg:mb-2">Пропонуємо</legend>
                            <p className="text-common-light mb-2">Опишіть, що ваша компанія пропонує своїм працівникам: медичну страховку, відпустки тощо.</p>
                        </div>
                        <div className="lg:w-[464px]">
                            <Textarea className={`${errors.offer && "border-red-500"} bg-[#F9FAFB]`} placeholder="Пропонуємо"
                                onChange={(e) => handleChange({offer: e.target.value})}
                                
                            />
                            {errors.offer && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.offer}</p>}
                            <div className="filters-text">{(formdata.offer ?? "").length}/1000</div>
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