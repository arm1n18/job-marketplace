import { cn } from "@/lib/utils";
import { KeyWord } from "../../ui/key-word";
import { KeywordsType } from "@/types/types";
import { Resume } from "./ResumeDetailsTypes";
import { Button } from "@/components/ui/button";
import { Parameters } from "@/components/ui/parametrs";
import { SectionDescription } from "@/components/ui/section-description";
import { ParametersLine } from "@/components/ui/parametrs-line";
import { ApplyButton } from "@/components/ui/applyButton";
import { useAuth } from "@/components/hook/isLoggedIn";

interface Props extends Resume{
    keywords?: KeywordsType[];
    isMainPage?: boolean;
    className ?: string;
}

export const ResumeMainCard: React.FC<Props> = ({
    isMainPage,
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
        const { isLoggedIn, role } = useAuth();
    return (
        <>  
            <div className={cn("flex-grow bg-gray-selected rounded-lg sticky p-8", className)}>
                <header className="w-full flex justify-between items-center">
                        <div className="w-full flex justify-between">
                                <h2 className="text-title-bg leading-none">{title}</h2>
                                <span className="text-salary-bg leading-none">${salary}{isMainPage ? ' / на місяць' : ''}</span>
                        </div>
                </header>

                {keywords?.length ? (
                    <>
                        <div className="flex items-center gap-3 flex-wrap mt-6">
                            {keywords.map((keyword) => (
                                <KeyWord className="key-word-block-bg" key={keyword.id} keyword={keyword.name} />
                            ))}
                        </div>
                    </>
                ) : null}
                    
                <div className="line-gray my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <ParametersLine IconName="PcCase" name="Напрямок:" description={`${subcategory_name || category_name}`}/>
                    <ParametersLine IconName="MapPin" name="Місто:" description={`${city_name || "Україна"}`}/>
                    <ParametersLine IconName="CalendarFold" name="Досвід:" description = {experience ? `${experience} ${experience > 4 ? "років" : (experience > 1 ? "роки" : "рік")} досвіду` : "Без досвіду" }/>
                    <ParametersLine IconName="BriefcaseBusiness" name="Зайнятість:" description={`${employment_name}`}/>
                </div>

                <div className="line-gray my-6" />

                <div>
                    <SectionDescription className="mb-6" title={"Досвід роботи"} description={work_experience} />
                    {achievements && achievements.length > 0 && (
                        <SectionDescription className="mb-6" title={"Досягнення"} description={achievements} />
                    )}

                </div>
                
                <div className="w-full align-end">
                    <ApplyButton className="w-full" title="Запропонувати вакансію"
                        isLoggedIn={isLoggedIn} role={role} roleAccess={"RECRUITER"} />
                </div>
            </div>
        </>
    )
}