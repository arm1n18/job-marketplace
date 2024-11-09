'use client';

import { Container } from "@/components/Container";
import { Role, useAuth } from "@/components/hook/isLoggedIn";
import { validationFormAuth } from "@/components/shared/validation-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Login() {
    const [formData, setFormData] = useState<{email: string, password: string}>({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [serverError, setServerError] = useState("");
    const { setIsLoggedInValue, isLoggedIn, setRole, setId, setEmail } = useAuth();

    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/jobs');
        }
    }, [isLoggedIn]);


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
        
        console.log(formData);

        try {
            const response = await axios.post(`http://192.168.0.106:8080/auth/login`, {...formData}, {
                withCredentials: true,
            });
            if (response.status === 200) {
                localStorage.setItem('access_token', response.data.token);
                const decodedToken = jwtDecode<Role>(response.data.token);
                setRole(decodedToken.role);
                setId(decodedToken.id);
                setEmail(decodedToken.email);
                setIsLoggedInValue(true);
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.error("Помилка при вході:", err.response.data);
                setServerError(err.response.data.message || "Невідома помилка");
            } else {
                console.error("Помилка при вході:", err);
                setServerError("Невідома помилка");
            }
        }
        
    }

    return <>
        <Container className="flex items-center flex-col">
            <h1 className="text-title-dark my-12">Увійти на сайт</h1>

            <form className="w-[482px] flex flex-col" onSubmit={handleSubmit}>
                <Input className={errors.email || serverError ? "w-full border-red-500" : "w-full mb-6 bg-[#F9FAFB]"}
                    placeholder="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}/>
                {serverError && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{serverError}</p>}
                {errors.email && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.email}</p>}
                <Input className={errors.password ? "w-full border-red-500" : "w-full mb-6 bg-[#F9FAFB]"}
                    placeholder="Пароль"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleInputChange}/>
                {errors.password && <p className="text-red-500 mb-6 flex gap-1"><CircleAlert className="mt-1" size={16}/>{errors.password}</p>}

                <Button className="w-[160px] my-6 mx-auto"  type="submit">
                    Увійти
                </Button>

                <a href="/register" className="text-common hover:underline mx-auto">або зареєструватись</a>
            </form>

        </Container>
    </>
}