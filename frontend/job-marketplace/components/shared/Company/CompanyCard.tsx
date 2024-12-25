import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { SectionDescription } from "@/components/ui/section-description";
import { NoImgAvatars } from "@/components/ui/noImgAvatars";
import { Company } from "@/types/company.type";
import Image from 'next/image';

interface Props extends Company{
    className ?: string;
}

export const CompanyCard: React.FC<Props> = ({
    company_name,
    about_us,
    image_url,
    website,
    linkedin,
    facebook,
    className }) => {
        
    return (
        <div className={cn("rounded-lg p-8 bg-gray-selected w-full", className)}>
            <header className="w-full flex max-sm:flex-col justify-between sm:items-center">
                <div className="flex items-center gap-6 sm:justify-between">
                    {
                        image_url ? (
                            <Image className="rounded-[8px] w-16 h-16" width={256} height={256} src={image_url} alt="" />
                        ) : (<NoImgAvatars className="rounded-[8px] w-16 h-16 text-2xl" name={company_name} />)
                    }
                    <div className="flex flex-col gap-3">
                        <h2 className="text-title-bg leading-none">{company_name}</h2>
                        <a className="text-common-sm hover:underline leading-none flex gap-1 w-fit" href={website} target="_blank">
                            {company_name}
                            <ExternalLink className="size-3" />
                        </a>
                    </div>
                </div>
                <div className="flex gap-3 max-sm:mt-6">
                    {
                        linkedin &&
                        <a href={linkedin} target="_blank" className="flex gap-2"><Image className="w-8 h-8" width={64} height={64} src="/images/icons/linkedin.png" alt="" /><span className="my-auto text-common-blue">LinkedIn</span></a>
                    }
                    {
                        facebook && 
                        <a href={facebook} target="_blank" className="flex gap-2"><Image className="w-8 h-8" width={64} height={64} src="/images/icons/facebook.png" alt="" /><span className="my-auto text-common-blue">Facebook</span></a>
                    }
                </div>
            </header>

            <div className="border-gray-primary my-6" />

            <SectionDescription title={"Про нас"} description={about_us} />
        </div>
    )
}