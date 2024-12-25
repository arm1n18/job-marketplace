import { cn } from "@/lib/utils"
import Image from 'next/image';

interface Props {
    className ?: string
}

export const StackSection: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn("text-center", className)}>
            <h1 className="text-5xl font-bold mb-12 max-lg:text-3xl">Пошук за Вашим стеком</h1>
            <div className="flex flex-col gap-12 items-center max-md:gap-12">
                <div className="flex justify-between gap-24 max-md:grid max-md:grid-cols-3 max-md:gap-y-12">
                    <Image src="/images/icons/vuejs.png" className="w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="vuejs" />
                    <Image src="/images/icons/reactjs.png" className="w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="reactjs" />
                    <Image src="/images/icons/angular.png" className="w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="angular" />
                    <Image src="/images/icons/c++.png" className="w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="c++" />
                    <Image src="/images/icons/kotlin.png" className="w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="kotlin" />
                    <Image src="/images/icons/java.png" className="w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="java" />
                </div>
                <div className="flex justify-between gap-24 max-md:grid max-md:grid-cols-3 max-md:gap-y-12">
                    <Image src="/images/icons/python.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="python" />
                    <Image src="/images/icons/go.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="go" />
                    <Image src="/images/icons/docker.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="docker" />
                    <Image src="/images/icons/kubernetes.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="kubernetes" />
                    <Image src="/images/icons/rust.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="rust" />
                    <Image src="/images/icons/csharp.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="csharp" />
                </div>
                <div className="flex justify-between gap-24 max-md:grid max-md:grid-cols-3 max-md:gap-y-12">
                    <Image src="/images/icons/django.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="django" />
                    <Image src="/images/icons/nodejs.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="nodejs" />
                    <Image src="/images/icons/laravel.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="laravel" />
                    <Image src="/images/icons/flutter.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="flutter" />
                    <Image src="/images/icons/swift.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="swift" />
                    <Image src="/images/icons/php.png" className= "w-12 cursor-pointer hover:scale-110" width={128} height={128} alt="php" />
                </div>
            </div>
        </div>
    )
}