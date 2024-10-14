import { cn } from "@/lib/utils";
import { KeyWord } from "../../ui/key-word";
import { User } from "lucide-react";
import { Button } from "../../ui/button";
import { Job } from "./JobDetailsTypes";
import { SectionDescription } from "@/components/ui/section-description";
import { ParametersLine } from "@/components/ui/parametrs-line";
import { NoImgAvatars } from "@/components/ui/noImgAvatars";

interface Props extends Job{
    keyInfo?: string[];
    className ?: string;
}

export const JobMainCard: React.FC<Props> = ({
    image_url,
    company_name,
    title,
    description,
    requirements,
    about_us,
    offer,
    keywords,
    experience,
    employment_name,
    category_name,
    subcategory_name,
    city_name,
    salary_from,
    salary_to,
    created_at,
    className }) => {
        
        // const parameters = [
        //     { id: 1, name: "Виключно", description: experience ? `від ${experience} ${experience > 1 ? "років" : "року"} досвіду` : "Без досвіду" },
        //     { id: 2, name: "Зайнятість", description: employment_name },
        //     { id: 3, name: "Кандидат з", description: city_name || "Україна" },
        //     { id: 4, name: "Офіс", description: city_name || "Ні" },
        //     { id: 5, name: "Напрямок", description: subcategory_name || category_name },
        //     { id: 6, name: "Домен", description: "Marketplace" },
        // ];

        const safeCompanyName = company_name || 'default-company';
    return (

        <>  
            <div className={cn("flex-grow bg-gray-selected rounded-lg sticky p-8", className)}> {/* было p-16 */}
                <header className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-6 justify-between">
                            {
                                image_url ? (
                                    <img className="rounded-[8px] w-16 h-16" src={image_url} alt="" />
                                ) : (<NoImgAvatars className="rounded-[8px] w-16 h-16 text-2xl" companyName={company_name} />)
                            }
                            <div className="flex flex-col gap-3">
                                <h2 className="text-title-bg leading-none">{title}</h2>
                                <a className="text-common-sm hover:underline leading-none flex gap-1 w-fit" href={`/company/${safeCompanyName.replace(' ', '-')}`} target="_blank">
                                    {company_name}
                                    <User className="size-3" strokeWidth={3} />
                                </a>
                            </div>
                        </div>
                        <Button>Відгукнутись</Button>
                </header>

                <div className="my-6">
                    <span className="text-salary-bg leading-none">
                        {salary_from && `від $${salary_from} `}
                        {salary_to && `до $${salary_to}`}
                    </span>
                </div>

                {keywords?.length ? (
                    <>
                        <div className="border-gray-primary my-6" />
                        <div className="flex items-center gap-3 flex-wrap">
                            {keywords.map((keyword) => (
                                <KeyWord className="key-word-block-bg" key={keyword.id} keyword={keyword.name} />
                            ))}
                        </div>
                    </>
                ) : null}

                <div className="border-gray-primary my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <ParametersLine IconName="PcCase" name="Напрямок:" description={`${subcategory_name || category_name}`}/>
                    <ParametersLine IconName="MapPin" name="Кандидат з:" description={`${city_name || "Україна"}`}/>
                    <ParametersLine IconName="CalendarFold" name="Виключно:" description={experience ? `від ${experience} ${experience > 1 ? "років" : "року"} досвіду` : "Без досвіду" }/>
                    <ParametersLine IconName="Building" name="Офіс:" description={`${city_name || "Ні"}`}/>
                    <ParametersLine IconName="BriefcaseBusiness" name="Зайнятість:" description={`${employment_name}`}/>
                    <ParametersLine IconName="CalendarClock" name="Опубліковано:" description={created_at && new Date(created_at).toLocaleDateString("uk-UA", {day: "numeric", month: "long"})}/>
                </div>

                <div className="border-gray-primary my-6" />

                <div>
                    <SectionDescription className="mb-6" title={"Про нас"} description={about_us} />
                    <SectionDescription className="mb-6" title={"Обов’язки:"}
                        description={
                            <ul className="list-disc pl-5">
                                {description?.split('\n').map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        } />
                    <SectionDescription
                        className="mb-6"
                        title={"Вимоги:"} 
                        description={<ul className="list-disc pl-5">
                            {requirements?.split('\n').map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>} 
                    />
                    <SectionDescription 
                    title={"Умови роботи:"} 
                    description={<ul className="list-disc pl-5">
                        {offer?.split('\n').map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>} 
                    />                    
                </div>
            </div>
        </>
    )
}