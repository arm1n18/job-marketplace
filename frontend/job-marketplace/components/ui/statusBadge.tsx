import { CircleAlert, CircleCheck, Clock, Dot, Loader, LoaderCircle } from "lucide-react"

interface Props {
    status: string,
    className?: string
}

export const StatusBadge: React.FC<Props> = ({status, className}) => {
    return (
        <>
            {status == "APPLICATION_PENDING" && (
                <div className={`badge APPLICATION_PENDING-badge flex gap-1 ${className}`}>
                    <LoaderCircle strokeWidth={3} color="#1C64EE" size={12} />Очікується
                </div>
            )}
            {status == "SUCCEEDED" && (
                <div className={`badge succeeded-badge flex gap-1 ${className}`}>
                    <CircleCheck strokeWidth={3} color="#ECFDF3" size={16} fill="green"/>Схвалено
                </div>
            )}
            {status == "CANCELED" && (
                <div className={`badge canceled-badge flex gap-1 ${className}`}>
                    <CircleAlert strokeWidth={3} color="#FDECEC" size={16} fill="red"/>Відхилено
                </div>
            )}
        </>
    )
}