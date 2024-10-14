import { cn } from "@/lib/utils";

interface Props {
    companyName : string;
    className ?: string;
}

export const NoImgAvatars: React.FC<Props> = ({companyName, className }) => {

    const colors = [
        "redAvatar",
        "orangeAvatar",
        "pinkAvatar",
        "blueAvatar",
        "greenAvatar",
        "purpleAvatar"
    ];

    const generateAvatarColor = (str : string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
        }
        return colors[hash % colors.length];
    }

    const hash = generateAvatarColor(companyName);

    return (
        <>  
            <div className={cn("flex items-center justify-center", hash, className)}>
                <p className="font-bold line-clamp-none">{companyName[0].toUpperCase()}</p>
            </div>
        </>
    )
}