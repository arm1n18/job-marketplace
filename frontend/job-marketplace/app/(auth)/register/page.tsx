'use client';

import { Container } from "@/components/Container";
import { useAuth } from "@/components/hook/AuthContext";
import { validationFormAuth } from "@/components/shared/validation-form";
import { Button, Input, RoleButton } from "@/components/ui";
import AuthService from "@/services/AuthService";
import { Roles } from "@/types";
import { CircleAlert } from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";

export default function Register() {
    const [selectedRole, setSelectedRole] = React.useState<Roles | null>(null);
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

    const handleClick = (role: Roles) => {
        setSelectedRole(role);
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
        } else if(!selectedRole) {
            return;
        }

        const dataToSend = {
            ...formData,
            role: selectedRole,
        };

        const registerUser = new AuthService({ data: dataToSend, router}, { setLoggedIn: setLoggedIn, setRole, setId, setEmail });
        const response = await registerUser.registerUser();

        if (response && response.error) {
            setErrors({});
            setServerError(response.error);
        }
    }
    
    return <>
        <Container className="flex items-center flex-col">
            <h1 className="text-title-dark my-12">Зареєструватись на сайті</h1>

            <div className="w-fit flex items-center flex-col px-4">
                <div className="max-w-96 bg-non-selected rounded-lg flex mb-12">
                    <RoleButton role={"Кандидат"} isSelected={selectedRole === 'CANDIDATE'} onClick={() => handleClick('CANDIDATE')} />
                    <div className="absolute h-24 w-[1px] bg-[#D0D5DD] left-1/2 transform -translate-x-1/2"/>
                    <RoleButton role={"Рекрутер"} isSelected={selectedRole === 'RECRUITER'} onClick={() => handleClick('RECRUITER')} />
                </div>
                <form className="w-full flex flex-col items-center " onSubmit={handleSubmit}>
                    <div className="w-full">
                        <Input className={errors.email || serverError ? " border-red-500" : "mb-6 bg-[#F9FAFB]"}
                            placeholder="Email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                        />
                        {serverError && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{serverError}</p>}
                        {errors.email && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.email}</p>}
                        <Input
                            className={errors.password ? " border-red-500" : "mb-6 bg-[#F9FAFB]"}
                            type="password"
                            placeholder="Пароль" 
                            name="password"
                            value={formData.password || ''} 
                            onChange={handleInputChange}
                        />
                        
                        {errors.password && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.password}</p>}
                    </div>
                    <Button className="w-[160px] my-6 mx-auto" type="submit">
                        Зареєструватись
                    </Button>
                    
                </form>

                <a href="/login" className="text-common hover:underline">або увійти в існуючий акаунт</a>
            </div>

        </Container>
    </>
}