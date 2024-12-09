'use client'

import { categories, cities, employment } from "@/components/consts/filters-consts";
import { useAuth } from "@/components/hook/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckBoxesSection } from "@/components/ui/checkBoxesSection";
import { FilterDropDown } from "@/components/ui/filterDropDown";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ProfileType } from "@/types/profile.type";
import { Asterisk, CircleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
    className?: string;
    data?: ProfileType;
    setData: React.Dispatch<React.SetStateAction<any>>;
}

export const CandidateProfile: React.FC<Props> = ({ data, setData }) => {
    const [minValue, setMinValue] = useState([0]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { avatarUrl, email } = useAuth();

    const handleTextSubmit = (value: string | number, fieldName: string) => {
        // setFormData({ ...formData, [fieldName]: value});
    };

    const handleGroupClick = (group: string, subgroup: string) => {
        // setFormData({ ...formData, "category_name": group, "subcategory_name": subgroup});
    };

    const handleExperienceSubmit = (value: number) => {
        setData({ ...data, "experience": value});
    }

    const handleCheckBoxClick = (title: string) => {
        setData({ ...data, "employment_name": title});
        console.log(`Checkbox clicked: ${title}`);
    };

    
    return (
        <>
            {data !== undefined && (
                <div className="max-md:w-full max-w-[976px] rounded-md bg-[#FEF3EA] border border-opacity-30 border-[#E7994B] p-2 mb-6">
                    <h1 className="text-center font-bold text-[#AE7236]">Профіль потрбіно заповнити.</h1>
                    <p className="text-center text-[#AE7236]">Перед початком пошуку ви повинні заповнити свій профіль, щоб він
                        відповідав усім умовам. Це можна зробити тут або <Link href={`/candidates/create`} className="underline underline-offset-4 italic font-semibold">за посиланням</Link>.</p>
                </div>
            )}
            <div className="flex flex-col lg:gap-12 lg:flex-row">
                <div>
                    <div className="w-full mb-6 lg:w-[464px]">
                        <label className="text-common-dark">Посада</label>
                        <Input className={`w-full ${errors.recruiter_name && "border-red-500"} bg-[#F9FAFB] mt-2`}
                            placeholder="Наприклад: JavaScript / Front-End розробник"
                            defaultValue={data?.title}
                            // onChange={(e) => handleTextSubmit(e.target.value, "recruiter_name")}
                        />
                        {errors.recruiter_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.recruiter_name}</p>}
                    </div>
                    <div className="w-full mb-6 lg:w-[464px]">
                        <label className="text-common-dark">Категорія</label>
                        <FilterDropDown
                            className="mt-2"
                            title={"JavaScript / Front-End"}
                            categories = {categories}
                            setSelectedGroup={handleGroupClick}
                            defaultValue={String(data?.category_name)}
                            defaultSubValue={String(data?.subcategory_name)}
                        />
                        {errors.category_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.category_name}</p>}
                    </div>
                    <div className="w-full mb-6 lg:w-[464px]">
                        <label className="text-common-dark">Місто</label>
                        <FilterDropDown
                            className="mt-2"
                            title={"Місто"}
                            categories = {cities}
                            // setSelectedGroup={handleCityClick}
                            defaultValue={String(data?.city_name)}
                        />
                    </div>
                    <div className="w-full mb-6 lg:w-[464px]">
                        <label className="text-common-dark">Заробітна плата</label>
                        <div className="flex mt-2">
                            <div className={`${errors.salary ? "bg-error" : "bg-gray-selected"} w-16 flex items-center justify-center rounded-l-md filters-text`}>$</div>
                            <Input className={`w-28 bg-[#F9FAFB] rounded-l-none border-l-0 ${errors.salary && "bg-error"}`}
                                placeholder="1500"
                                defaultValue={data?.salary}
                                onChange={(e) => handleTextSubmit(Number(e.target.value), "salary")}
                            />
                            <p className="text-common-dark my-auto ml-2">/ на місяць</p>
                        </div>
                        {errors.salary && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.salary}</p>}
                    </div>
                    
                    <div className="w-full mb-6 lg:w-[464px]">
                        <label className="text-common-dark">Досвід роботи</label>
                        <div className="w-full flex flex-col justify-between h-9 mt-2">
                            <p className="filters-text">{data?.experience || 0} {Number(data?.experience) > 4 || Number(data?.experience) == 0 ? "років" : (Number(data?.experience) > 1 ? "роки" : "рік")} досвіду</p>
                            <Slider
                                value={[Number(data?.experience) || 0] }       
                                defaultValue={[0]}                   
                                max={10}
                                step={0.5}
                                className="w-full"
                                onValueChange={(minValue) => {setMinValue(minValue), handleExperienceSubmit(minValue[0])}}
                            />
                        </div>
                    </div>
                    <div className="w-full mb-6 lg:w-[464px]">
                        <label className="text-common-dark">Формат</label>
                            <CheckBoxesSection
                                className="mt-2"
                                defaultValue={String(data?.employment_name)}
                                title={employment}
                                setSelectedFormat={handleCheckBoxClick}
                            />
                            {errors.employment_name && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.employment_name}</p>}
                    </div>
                </div>
                <div className="w-full mb-6 lg:w-[464px] flex flex-col">
                    <div className="mb-6">
                        <label className="text-common-dark">Досвід роботи</label>
                        <Textarea className={`${errors.work_experience && "border-red-500"} bg-[#F9FAFB] mt-2 min-h-60`} placeholder="Досвід роботи"
                            defaultValue={data?.work_experience}
                            onChange={(e) => handleTextSubmit(e.target.value, "work_experience")}
                        />
                        {errors.work_experience && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.work_experience}</p>}
                    </div>
                    <div>
                        <div className="flex gap-1">
                            <label className="text-common-dark mb-2">Досягнення</label>
                            <Asterisk color="#1C64EE" size={12}/>
                        </div>
                        <Textarea className="bg-[#F9FAFB] min-h-60" placeholder="Досягнення"
                            defaultValue={data?.achievements}
                            onChange={(e) => handleTextSubmit(e.target.value, "achievements")}
                        />
                        {errors.achievements && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.achievements}</p>}
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
            </div>
        </>
    )
}