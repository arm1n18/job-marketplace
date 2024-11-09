"use client";

import { Container } from "@/components/Container";
import { MyApplications } from "@/components/shared/Profile/MyApplications";
import { MyProfile } from "@/components/shared/Profile/MyProfile";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Profile() {
    const [section, setSection] = useState(1);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    return (
        <div className="mx-2">
            <Container className="mt-12">
                <h1 className="text-title-dark my-12">Мій профіль</h1>
                <div className="flex justify-between">
                    <div className="flex gap-6">
                        <div className={section == 0 ? "filters-block-selected" : "filters-block"} onClick={() => setSection(0)}>Мій профіль</div>
                        <div className={section == 1 ? "filters-block-selected" : "filters-block"} onClick={() => setSection(1)}>Мої відгуки</div>
                        <div className={section == 2 ? "filters-block-selected" : "filters-block"} onClick={() => setSection(2)}>Інше</div>
                    </div>
                    <div className="filters-block-red flex items-center gap-3"><LogOut color="red" size={16}/>Вийти</div>
                </div>
                <div className="line-gray my-12" />
                {section == 0 && (
                    <MyProfile />
                )}
                {section == 1 && (
                    <MyApplications />
                )}
            </Container>
        </div>
    )
}
