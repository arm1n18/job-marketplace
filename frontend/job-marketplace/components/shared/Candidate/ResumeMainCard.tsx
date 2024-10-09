import { cn } from "@/lib/utils";
import { KeyWord } from "../../ui/key-word";
import { KeywordsType } from "@/types/types";
import { Resume } from "./ResumeDetailsTypes";
import { Button } from "@/components/ui/button";
import { Parameters } from "@/components/ui/parametrs";
import { SectionDescription } from "@/components/ui/section-description";

interface Props extends Resume{
    keywords?: KeywordsType[];
    className ?: string;
}

export const ResumeMainCard: React.FC<Props> = ({
    experience,
    title,
    employment_name,
    city_name,
    work_experience,
    salary,
    subcategory_name,
    category_name,
    achievements,
    keywords,
    className }) => {
        const parameters = [
            { id: 1, name: "Місто", description: city_name || "Україна" },
            { id: 2, name: "Досвід", description: experience ? `${experience} ${experience > 5 ? "років" : (experience > 1 ? "роки" : "рік")} досвіду` : "Без досвіду" },
            { id: 3, name: "Зайнятість", description: employment_name },
            { id: 4, name: "Напрямок", description: subcategory_name || category_name },
        ];

    return (
        <>  
            <div className={cn("flex-grow bg-gray-selected rounded-lg sticky p-5", className)}>
                <header className="w-full flex justify-between items-center">
                        <div className="w-full flex justify-between">
                                <h2 className="text-title-bg leading-none">{title}</h2>
                                <span className="text-salary-bg leading-none">${salary}</span>
                        </div>
                </header>

                {keywords?.length ? (
                    <>
                        <div className="flex items-center gap-3 flex-wrap mt-6">
                            {keywords.map((keyword) => (
                                <KeyWord className="key-word-block" key={keyword.id} keyword={keyword.name} />
                            ))}
                        </div>
                    </>
                ) : null}
                    
                <div className="border-gray-primary my-6" />

                <Parameters parameters={parameters} />

                <div className="border-gray-primary my-6" />

                <div>
                    <SectionDescription className="mb-6" title={"Досвід роботи"} description={work_experience} />
                    {achievements && achievements.length > 0 && (
                        <SectionDescription className="mb-6" title={"Досягнення"} description={achievements} />
                    )}

                </div>
                
                <div className="w-full align-end">
                    <Button className="w-full">Запропонувати вакансію</Button>
                </div>
            </div>
        </>
    )
}