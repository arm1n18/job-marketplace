'use client';

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleButton } from "@/components/ui/role-button";
import { Roles } from "@/types/types";
import Link from "next/link";
import React from "react";

export default function Register() {
    const [selectedRole, setSelectedRole] = React.useState<Roles | null>(null);


    const handleClick = (role: Roles) => {
        setSelectedRole(role);

        console.log("Selected role:", role); {/*удалить*/}
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
                <Input className="w-full mb-6 bg-[#F9FAFB]" placeholder="Email" />
                <Input className="w-full bg-[#F9FAFB]" placeholder="Пароль" />

                <Button asChild className="w-[160px] my-6 mx-auto">
                    <Link href="/">Зареєструватись</Link>
                </Button>

                <a href="/login" className="text-common hover:underline">або увійти в існуючий акаунт</a>
            </div>

        </Container>
    </>
}