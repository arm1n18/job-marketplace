import { cn } from "@/lib/utils";
import { Filter } from "../ui/filter";
import { Slider } from "@/components/ui/slider"
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";

interface Props {
    className ?: string;
}

export const FiltersSection: React.FC<Props> = ({ className, }) => {
    const [reset, setReset] = useState<boolean>(false);

    // Подправить в будущем (Zustand, Redux)
    let filters = {
        category: '',
        experience: '',
        city: '',
        employment: '',
    };

    const handleSelect = (item: string | null, title: string) => {
        title == 'Категорії' && item !== null && (filters.category = item);
        title == 'Досвід' && item !== null && (filters.experience = item);
        title == 'Місто' && item !== null && (filters.city = item);
        title == 'Зайнятість' && item !== null && (filters.employment = item);
        // console.log(filters);
    };

    const handleReset = () => {
        setMinValue([0]);
        const categories = ['Категорії', 'Досвід', 'Місто', 'Зайнятість'];
        categories.forEach((category) => handleSelect(null, category));
        setReset(true);
        setTimeout(() => {
            setReset(false);
        }, 100);
    };

    const [minValue, setMinValue] = useState([0]);
    
    return (
        <div className={cn("flex justify-between", className)}>
                <div className="flex items-center gap-6">
                    <Filter
                        onReset={reset ?? false}
                        onSelect={(item, title) =>handleSelect(item, title)}
                        title={"Категорії"}
                        filters={['JavaScrcipt / Front-End', 'Fullstack', 'Flutter', 'Java', 'C / C++ / Embedded']}
                        minWidth="min-w-48"/>
                    <Filter onReset={reset ?? false} onSelect={(item, title) =>handleSelect(item, title)} title={"Досвід"} filters={['Без досвіду', '1 рік', '2 роки', '3 роки', '4 роки', '5 років', '6 років', '7 років', '8 років', '9 років', '10 + років']} minWidth="min-w-32"/>
                    <Filter onReset={reset ?? false} onSelect={(item, title) =>handleSelect(item, title)} title={"Місто"} filters={['Вся Україна', 'Одеса', 'Київ', 'Львів', 'Харків', 'Дніпро', 'Вінниця', 'Житомир']} minWidth="min-w-32"/>
                    <Filter onReset={reset ?? false} onSelect={(item, title) =>handleSelect(item, title)} title={"Зайнятість"} filters={['Віддалена робота', 'Part-time', 'Офіс']} minWidth="min-w-40"/>
                    <div className="h-[37px] flex flex-col justify-between">
                        <p className="filters-text">Зарплата від: ${minValue}</p>
                        <Slider value={minValue} max={10000} step={500} className={"max-w-60 min-w-60"} onValueChange={(minValue)=> {setMinValue(minValue)}}/>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button className="w-fit" variant="outline" onClick={handleReset}><X className="w-4 h-4"/></Button>
                    <Button className="w-fit"><Check className="w-4 h-4" /></Button>
                </div>
        </div>
    )
}