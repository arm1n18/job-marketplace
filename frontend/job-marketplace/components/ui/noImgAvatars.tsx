import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Skeleton } from './skeleton';

interface Props {
    className?: string;
    name: string;
}

export const NoImgAvatars: React.FC<Props> = ({ name, className }) => {
    const colors = [
        "redAvatar",
        "orangeAvatar",
        "pinkAvatar",
        "blueAvatar",
        "greenAvatar",
        "purpleAvatar"
    ];

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (name) {
            setIsLoading(false);
        }
    }, [name]);

    if (isLoading || !name) {
        return <Skeleton className={cn("", className)} />;
    }

    const generateAvatarColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const hash = generateAvatarColor(name);

    return (
        <div className={cn("text-xs flex items-center justify-center", hash, className)}>
            <p className="font-bold line-clamp-none">{name[0].toUpperCase()}</p>
        </div>
    );
};
