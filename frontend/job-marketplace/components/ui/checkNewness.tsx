import { CalendarClock, Sparkles } from "lucide-react";
import { isNew } from "../hook/isNew";

interface Props {
    created_at: string;
}

export const IsNew: React.FC<Props> = ({ created_at }) => { 

    const dateText = isNew(created_at, new Date());

    return (
        <div>
            { created_at && (
                dateText == 'Нове' ?
                <div>
                    <div className='key-word-block flex gap-[2px]'>
                        <Sparkles className="size-4 icon-gray -translate-y-0.1" strokeWidth={2} />
                        {dateText}
                    </div>
                </div>
                : <div className="flex gap-1 text-common-sm">
                    <CalendarClock className="size-4 -translate-y-0.2" strokeWidth={2} />
                    {dateText}
                </div>
            
            )}
        </div>
    )
}