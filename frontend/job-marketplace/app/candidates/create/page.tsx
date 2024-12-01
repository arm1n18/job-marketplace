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
import { Asterisk, CircleAlert } from "lucide-react";
import { useFormSubmit } from "@/components/hook/useFormSubmit";
import { useAuth } from "@/components/hook/AuthContext";
import { useRouter } from "next/navigation";

export default function CreateJob() {
    const { email, id} = useAuth();
    const router = useRouter();

    const [minValue, setMinValue] = useState([0]);
    const [formData, setFormData] = useState({ title: '', category_name: '', subcategory_name: '',
    salary: 0, city: '', employment_name: '', experience: 0, work_experience: '', achievements: '', email: email ?? '', id: id ?? '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    const handleTextSubmit = (value: string | number, fieldName: string) => {
        setFormData({ ...formData, [fieldName]: value});
    };

    const handleGroupClick = (group: string, subgroup: string) => {
        setFormData({ ...formData, "category_name": group, "subcategory_name": subgroup});
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        console.log(formData);

        e.preventDefault();
        await useFormSubmit({
            e, 
            url: "candidates/create",
            dataToSend: formData,
            setLoading: () => {},
            validationZod: validationCreateResume,
            setErrors,
            router,
            message: "Резюме успішно створено!",
            redirectURL: "candidates",
        });
    }

    return (
        <div className="mx-4 mb-24">
            <Container className="mt-12">
                <h1 className="text-title-dark my-12">Оформелення профілю</h1>
                <div className="line-gray mb-12" />
                <form className="lg:w-fit" onSubmit={handleSubmit}>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Посада</legend>
                        <div className="lg:w-[464px]">
                            <Input className={`w-full ${errors.title && "border-red-500"} bg-[#F9FAFB]`}
                                placeholder="Наприклад: JavaScript / Front-End розробник"
                                onChange={(e) => handleTextSubmit(e.target.value, "title")}
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
                        <legend className="text-common-dark max-lg:mb-2">Досвід роботи</legend><div className="lg:w-[464px]">
                            <div className="lg:w-[464px] flex flex-col justify-between h-[36px]">
                            <p className="filters-text">{minValue[0]} {minValue[0] > 4 ? "років" : (minValue[0] > 1 ? "роки" : "рік")} досвіду</p>
                            <Slider
                                max={10}
                                step={0.5}
                                className="w-full"
                                onValueChange={(minValue) => {setMinValue(minValue), handleTextSubmit(minValue[0], "experience")}}
                            />
                        </div>
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Заробітна плата</legend>
                        <div className="lg:w-[464px]">
                            <div className="flex">
                                <div className={`${errors.salary ? "bg-error" : "bg-gray-selected"} w-16 flex items-center justify-center rounded-l-md filters-text`}>$</div>
                                <Input className={`w-28 bg-[#F9FAFB] rounded-l-none border-l-0 ${errors.salary && "bg-error"}`}
                                    placeholder="1500"
                                    onChange={(e) => handleTextSubmit(Number(e.target.value), "salary")}
                                />
                                <p className="text-common-dark my-auto ml-2">/ на місяць</p>
                            </div>
                            {errors.salary && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.salary}</p>}
                        </div>
                    </div>
                    <div className="grid mb-12 lg:grid-cols-2">
                        <legend className="text-common-dark max-lg:mb-2">Місто</legend>
                        <div className="lg:w-[464px]">
                        <FilterDropDown
                                title={"Місто"}
                                categories = {cities}
                                setSelectedGroup={(e) => handleTextSubmit(e, "city")}
                            />
                        </div>
                    </div>
                    <div className="grid mb-12 lg:mb-24 lg:grid-cols-2">
                        <legend className="text-common-dark max-w-32 max-lg:mb-2">Формат</legend>
                        <div className="lg:lg:w-[464px]">
                            <CheckBoxesSection title={employment}
                                setSelectedFormat={(e) => handleTextSubmit(e, "employment_name")}
                            />
                            {errors.employment_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.employment_name}</p>}
                        </div>
                    </div>

                    <div className="grid mb-12 lg:grid-cols-2">
                        <div className="flex flex-col lg:max-w-56">
                            <legend className="text-common-dark max-lg:mb-2">Досвід роботи</legend>
                            <p className="text-common-light mb-2">Опишіть свої досвід роботи на минулій позиції, технології,
                                які ви використовували та над чим працювали.</p>
                        </div>
                        <div className="lg:w-[464px]">
                            <Textarea className={`${errors.work_experience && "border-red-500"} bg-[#F9FAFB]`} placeholder="Досвід роботи"
                                onChange={(e) => handleTextSubmit(e.target.value, "work_experience")}
                            />
                            {errors.work_experience && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.work_experience}</p>}
                            <div className="filters-text">{formData.work_experience.length}/2000</div>
                        </div>
                    </div>
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
                                onChange={(e) => handleTextSubmit(e.target.value, "achievements")}
                            />
                            {errors.achievements && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.achievements}</p>}
                            <div className="filters-text">{formData.achievements.length}/2000</div>
                        </div>
                    </div>
                    <div className="flex lg:justify-end gap-4">
                        <Button variant="outline" onClick={() => router.back()}>
                                Скасувати
                        </Button>
                        <Button className="max-md:w-48" onClick={() => handleSubmit}>
                            Опублікувати резюме
                        </Button>
                    </div>
                </form>
            </Container>
        </div>
    )
}
