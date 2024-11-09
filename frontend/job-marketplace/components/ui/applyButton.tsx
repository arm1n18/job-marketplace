import { Button } from "./button"
import { cn } from "@/lib/utils";

interface Props {
    isLoggedIn: boolean;
    role: string | null;
    roleAccess: string;
    title: string;
    className ?: string;
}

export const ApplyButton: React.FC<Props> = ({isLoggedIn, role, roleAccess, title, className}) => {
    if (role === roleAccess && isLoggedIn) {
        return <Button className={cn("", className)}>{title}</Button>
    }
}