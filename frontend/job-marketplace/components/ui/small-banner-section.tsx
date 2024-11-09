import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react'

interface Props {
    className?: string;
    title: string;
    description: string;
    color?: string
    IconName: keyof typeof LucideIcons;
}

export const SmallBannerSection: React.FC<Props> = ({IconName, title, description, className, color}) => {
    const Icon = LucideIcons[IconName] as React.ComponentType<{ className?: string; strokeWidth?: number; color?: string }>;
    return (
        <>  
            <div className='text-center h-fit max-w-60'>
                <div className={cn(`rounded-lg size-16 content-center mx-auto border-[1px] border-opacity-30`, className)}>
                    <Icon className="size-1/2 m-auto" color={`${color}`}/>
                </div>
                <div className='mt-2'>
                    <h2 className='text-base font-semibold mb-2'>{title}</h2>
                    <p className='text-common'>{description}</p>
                </div>
            </div>
        </>
    )
}