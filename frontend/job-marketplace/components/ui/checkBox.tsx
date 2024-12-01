import { cn } from "@/lib/utils";

interface Props {
    name?: string;
    checked?: boolean;
    className?: string;
    setSelectedFormat: (name: string) => void;
}

export const CheckBox: React.FC<Props> = ({className, setSelectedFormat, name, checked}) => {
    return(
        <div className={cn(className, "flex gap-2 items-center custom-radio")} onClick={() => setSelectedFormat(name!)}>
            <input type="radio" className="size-5" onChange={() => setSelectedFormat(name!)} checked={checked}/>
            <p className="text-common-dark">{name}</p>
        </div>
    )     
}