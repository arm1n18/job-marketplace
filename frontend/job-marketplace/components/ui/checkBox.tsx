import { cn } from "@/lib/utils";

interface Props {
    name?: string;
    checked?: boolean;
    className?: string;
    setSelectedFormat: (name: string) => void;
}

export const CheckBox: React.FC<Props> = ({className, setSelectedFormat, name, checked}) => {
    return(
        <div className={cn(className, "flex gap-2 items-center")}>
            <input type="checkbox" className="size-4" onChange={() => setSelectedFormat(name!)} checked={checked}/>
            <p className="text-common-dark">{name}</p>
        </div>
    )     
}