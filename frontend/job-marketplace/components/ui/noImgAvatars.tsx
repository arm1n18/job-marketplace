import { cn } from "@/lib/utils";
import { Cookie } from "next/font/google";
import { cookies } from "next/headers";

interface Props {
    name : string;
    className ?: string;
}

export const NoImgAvatars: React.FC<Props> = ({name, className }) => {
    const colors = [
        "redAvatar",
        "orangeAvatar",
        "pinkAvatar",
        "blueAvatar",
        "greenAvatar",
        "purpleAvatar"
    ];
    const token = localStorage.getItem('access_token');

    // const getLetterFromEmail = 

    const generateAvatarColor = (str : string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    const hash = generateAvatarColor(name);

    return (
        <>  
            <div className={cn("flex items-center justify-center", hash, className)}>
                <p className="font-bold line-clamp-none">{name[0].toUpperCase()}</p>
            </div>
        </>
    )
}