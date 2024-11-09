import { cn } from "@/lib/utils"

interface Props {
    className ?: string
}

export const StackSection: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn("text-center", className)}>
            <h1 className="text-5xl font-bold mb-12">Пошук за Вашим стеком</h1>
            <div className="flex flex-col gap-12 items-center">
                <div className="flex justify-between gap-24">
                    <img src="/images/icons/vuejs.png" className="w-12 cursor-pointer hover:scale-110" alt="vuejs" />
                    <img src="/images/icons/reactjs.png" className="w-12 cursor-pointer hover:scale-110" alt="reactjs" />
                    <img src="/images/icons/angular.png" className="w-12 cursor-pointer hover:scale-110" alt="angular" />
                    <img src="/images/icons/typescript.png" className="w-12 cursor-pointer hover:scale-110" alt="typescript" />
                    <img src="/images/icons/c++.png" className="w-12 cursor-pointer hover:scale-110" alt="c++" />
                    <img src="/images/icons/kotlin.png" className="w-12 cursor-pointer hover:scale-110" alt="kotlin" />
                    <img src="/images/icons/java.png" className="w-12 cursor-pointer hover:scale-110" alt="java" />
                </div>
                <div className="flex justify-between gap-24">
                    <img src="/images/icons/python.png" className= "w-12 cursor-pointer hover:scale-110" alt="python" />
                    <img src="/images/icons/go.png" className= "w-12 cursor-pointer hover:scale-110" alt="go" />
                    <img src="/images/icons/docker.png" className= "w-12 cursor-pointer hover:scale-110" alt="docker" />
                    <img src="/images/icons/kubernetes.png" className= "w-12 cursor-pointer hover:scale-110" alt="kubernetes" />
                    <img src="/images/icons/rust.png" className= "w-12 cursor-pointer hover:scale-110" alt="rust" />
                    <img src="/images/icons/php.png" className= "w-12 cursor-pointer hover:scale-110" alt="php" />
                    <img src="/images/icons/csharp.png" className= "w-12 cursor-pointer hover:scale-110" alt="csharp" />
                </div>
                <div className="flex justify-between  gap-24">
                    <img src="/images/icons/django.png" className= "w-12 cursor-pointer hover:scale-110" alt="django" />
                    <img src="/images/icons/nodejs.png" className= "w-12 cursor-pointer hover:scale-110" alt="nodejs" />
                    <img src="/images/icons/laravel.png" className= "w-12 cursor-pointer hover:scale-110" alt="laravel" />
                    <img src="/images/icons/flutter.png" className= "w-12 cursor-pointer hover:scale-110" alt="flutter" />
                    <img src="/images/icons/postgresql.png" className= "w-12 cursor-pointer hover:scale-110" alt="postgresql" />
                    <img src="/images/icons/mysql.png" className= "w-12 cursor-pointer hover:scale-110" alt="mysql" />
                    <img src="/images/icons/swift.png" className= "w-12 cursor-pointer hover:scale-110" alt="swift" />
                </div>
            </div>
        </div>
    )
}