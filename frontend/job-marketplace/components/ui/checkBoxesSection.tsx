import React, { useEffect } from 'react';
import { CheckBox } from './checkBox';
import { cn } from '@/lib/utils';

interface Props {
    defaultValue?: string | null;
    title: string[];
    setSelectedFormat?: (name: string | '') => void;
    className?: string;
}

export const CheckBoxesSection: React.FC<Props> = ({ className, title, setSelectedFormat, defaultValue}) => {
    const [isChecked, setChecked] = React.useState<string | null>(null);

    useEffect(() => {
        setChecked(String(defaultValue) || null);
    }, [defaultValue])

    const handleCheckBoxClick = (title: string) => {
        const newChecked = isChecked === title ? '' : title;
        setChecked(newChecked);
        if (setSelectedFormat) {
            setSelectedFormat(newChecked);
        }
    };
   
    return (
        <div className={cn("flex gap-4 max-sm:flex-col", className)}>
            {title.map((title, index) => (
                <CheckBox key={index} name={title} setSelectedFormat={handleCheckBoxClick} checked={isChecked == title}
                />
            ))}
        </div>
    );
};
