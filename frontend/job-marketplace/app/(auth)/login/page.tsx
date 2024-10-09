'use client';

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleButton } from "@/components/ui/role-button";
import { Roles } from "@/types/types";
import Link from "next/link";
import React from "react";

export default function Login() {


    return <>
        <Container className="flex items-center flex-col">
            <h1 className="text-title-dark my-12">Увійти на сайт</h1>

            <div className="w-[482px] flex items-center flex-col">
                <Input className="w-full mb-6 bg-[#F9FAFB]" placeholder="Email" />
                <Input className="w-full bg-[#F9FAFB]" placeholder="Пароль" />

                <Button asChild className="w-[160px] my-6 mx-auto">
                    <Link href="/">Увійти</Link>
                </Button>

                <a href="/register" className="text-common hover:underline">або зареєструватись</a>
            </div>

        </Container>
    </>
}