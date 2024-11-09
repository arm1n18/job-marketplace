import { z } from 'zod';

export const validationFormAuth = z.object({
    email: z.string().email({ message: "Некоректна електронна адреса" }).min(5, { message: "Некоректна електронна адреса" }),
    password: z.string().min(6, { message: "Пароль має мати принаймні 6 символ" }),
})


export const validationCreateResume = z.object({
    title: z.string().min(5, { message: "Назва позиції занадто коротка" }).max(55, { message: "Максимальна довжина назви 55 символів" }),
    salary: z.number().min(100, { message: "Зарплата має бути більшою за $100" }),
    work_experience: z.string().min(400, { message: "Опис досвід роботи має складати мінімум 400 символів" }).max(2000, { message: "Максимальна довжина досвіду роботи 2000 символів" }),
    achievements: z.string().max(2000, { message: "Максимальна довжина опису доягеннь 2000 символів" }),
})

export const validationCreateJob = z.object({
    title: z.string().min(5, { message: "Назва позиції занадто коротка" }).max(55, { message: "Максимальна довжина назви 55 символів" }),
    description: z.string().min(300, { message: "Опис має складати мінімум 300 символів" }).max(2000, { message: "Максимальна довжина досвіду роботи 2000 символів" }),
    requirements: z.string().min(200, { message: "Опис вимог має складати мінімум 200 символів" }).max(2000, { message: "Максимальна довжина опису вимог 2000 символів" }),
    offer: z.string().min(200, { message: "Опис пропозицій має складати мінімум 200 символів" }).max(2000, { message: "Максимальна довжина опису доягеннь 1000 символів" }),
})

export const validationCreateCompany = z.object({
    company_name: z.string().min(1, { message: "Назва компанії занадто коротка" }).max(55, { message: "Максимальна довжина назви 55 символів" }),
    recruiter_name: z.string().min(2, { message: "Ім'я занадто коротке" }).max(55, { message: "Максимальна ім'я 55 символів" }),
    phone: z.string().regex(/^\d{12}$/, { message: "Некоректний номер телефону" }) ,
    about_us: z.string().min(200, { message: "Опис компанії має складати мінімум 200 символів" }).max(2000, { message: "Максимальна довжина опису компанії 2000 символів" }),
    web_site: z.string().url({ message: "Некоректнe посилання" }).or(z.literal("")),
    facebook: z.string().url({ message: "Некоректнe посилання" }).includes("facebook.com", { message: "Посилання має містити facebook.com" }).or(z.literal("")),
    linkedin: z.string().url({ message: "Некоректнe посилання" }).includes("linkedin.com", { message: "Посилання має містити linkedin.com" }).or(z.literal("")),
})