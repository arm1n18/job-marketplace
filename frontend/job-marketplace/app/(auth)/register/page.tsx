'use client';

import { Container } from "@/components/Container";
import { validationFormAuth } from "@/components/shared/validation-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleButton } from "@/components/ui/role-button";
import { Roles } from "@/types/types";
import axios from "axios";
import { CircleAlert } from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Register() {
    const [selectedRole, setSelectedRole] = React.useState<Roles | null>(null);
    const [formData, setFormData] = useState<{email: string, password: string}>({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [serverError, setServerError] = useState("");

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
        
        try {
            const response = await axios.post(`http://192.168.0.106:8080/auth/register`, dataToSend, {
                withCredentials: true,
            });
            if (response.status === 200) {
                localStorage.setItem('access_token', response.data.token);
                console.log("Token from localStorage:", response.data.token);
                if(selectedRole === 'CANDIDATE') {
                    router.push('/candidates/create');
                } else if (selectedRole === 'RECRUITER') {
                    router.push('/company/create');
                }
            }
        }catch (err) {
            toast.warn((err as Error).toString());
        }
    }
    
    return <>
        <Container className="flex items-center flex-col">
            <h1 className="text-title-dark my-12">Зареєструватись на сайті</h1>

            <div className="w-fit flex items-center flex-col">
                <div className="w-fit bg-non-selected rounded-lg flex mb-12">
                    <RoleButton role={"Кандидат"} isSelected={selectedRole === 'CANDIDATE'} onClick={() => handleClick('CANDIDATE')} />
                    <div className="absolute h-24 w-[1px] bg-[#D0D5DD] left-1/2 transform -translate-x-1/2"/>
                    <RoleButton role={"Рекрутер"} isSelected={selectedRole === 'RECRUITER'} onClick={() => handleClick('RECRUITER')} />
                </div>
                <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <Input className={errors.email || serverError ? "w-full border-red-500" : "w-full mb-6 bg-[#F9FAFB]"}
                            placeholder="Email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                        />
                        {serverError && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{serverError}</p>}
                        {errors.email && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.email}</p>}
                        <Input
                            className={errors.password ? "w-full border-red-500" : "w-full mb-6 bg-[#F9FAFB]"}
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