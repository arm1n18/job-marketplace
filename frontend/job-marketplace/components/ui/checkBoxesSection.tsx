import React from 'react';
import { CheckBox } from './checkBox';

interface Props {
    title: string[];
    setSelectedFormat: (name: string | '') => void;
    className?: string;
}

export const CheckBoxesSection: React.FC<Props> = ({ className, title, setSelectedFormat}) => {
    const [isChecked, setChecked] = React.useState<string | null>(null);

    const handleCheckBoxClick = (title: string) => {
        const newChecked = isChecked === title ? '' : title;
        setChecked(newChecked);
        setSelectedFormat(newChecked);
    };

    return (
        <div className={`flex gap-4 ${className}`}>
            {title.map((title, index) => (
                <CheckBox key={index} name={title} setSelectedFormat={handleCheckBoxClick} checked={isChecked == title}
                />
            ))}
        </div>
    );
};
