'use client';

import { Container } from "@/components/Container";
import { useAuth } from "@/components/hook/AuthContext";
import { validationFormAuth } from "@/components/shared/validation-form";
import { Button, Input} from "@/components/ui";
import AuthService from "@/services/AuthService";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Login() {
    const [formData, setFormData] = useState<{email: string, password: string}>({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [serverError, setServerError] = useState("");
    const { setLoggedIn, setRole, setId, setEmail } = useAuth();
    const router = useRouter();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerError("");
        const result  = validationFormAuth.safeParse(formData);
        if(!result.success) {
            const formErrors: { [key: string]: string } = {};
            result.error.errors.forEach((error) => {
                const path = error.path[0];
                formErrors[path as keyof typeof formErrors] = error.message;
            })
            setErrors(formErrors);
            return;
        }

        const loginUser = new AuthService({ data: formData, router}, { setLoggedIn, setRole, setId, setEmail });
        const response = await loginUser.loginUser();


        if (response && response.error) {
            setErrors({});
            setServerError(response.error);
        }
        
    }

    return <>
        <Container className="flex items-center flex-col">
            <h1 className="text-title-dark my-12">Увійти на сайт</h1>

            <form className="max-sm:w-full max-w-[482px] sm:w-[482px] flex flex-col px-4" onSubmit={handleSubmit}>
                <Input className={`${errors.email || serverError ? "border-red-500" : "bg-[#F9FAFB] mb-6"} w-full`}
                    placeholder="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}/>
                
                {errors.email && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.email}</p>}
                <Input className={`${errors.password || serverError ? " border-red-500 mt-6" : " bg-[#F9FAFB]"} w-full`}
                    type="password"
                    placeholder="Пароль"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleInputChange}/>
                {errors.password && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.password}</p>}
                {serverError && <p className="text-red-500 flex gap-1"><CircleAlert className="mt-1" size={16}/>{serverError}</p>}
                <Button className="w-[160px] my-6 mx-auto"  type="submit">
                    Увійти
                </Button>

                <a href="/register" className="text-common hover:underline mx-auto">або зареєструватись</a>
            </form>

        </Container>
    </>
}