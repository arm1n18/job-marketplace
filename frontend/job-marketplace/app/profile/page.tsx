"use client";

import { Container } from "@/components/Container";
import { useAuth } from "@/components/hook/AuthContext";
import { MyProfile, PersonalData } from "@/components/shared/Profile";
import UserService from "@/services/UserService";
import { ProfileType } from "@/types/profile.type";
import { useEffect, useState } from "react";

export default function Profile() {
    const [formData, setFormData] = useState<ProfileType | undefined>(undefined);
    const [section, setSection] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { role } = useAuth();

    useEffect(() => {
        const getProfile = new UserService({url: "user/profile", setData: setFormData, setSelectedData: setFormData, setLoading: setLoading});
        getProfile.getUserData();
    }, []);

    const sectionNames = ["Мій профіль", "Особисті дані", "Інше"];

    return (
        <div className="mx-4 mb-24">
            <Container className="mt-12">
                <h1 className="text-title-dark my-12">{sectionNames[section]}</h1>
                <div className="flex my-12 gap-2 w-full rounded-md">
                    <div className={`${section == 0 ? "filters-block-selected" : "filters-block"} flex w-full`} onClick={() => setSection(0)}>Мій профіль</div>
                    <div className={`${section == 1 ? "filters-block-selected" : "filters-block"} flex w-full`} onClick={() => setSection(1)}>Особисті дані</div>
                    <div className={`${section == 2 ? "filters-block-selected" : "filters-block"} flex w-full`} onClick={() => setSection(2)}>Інше</div>
                </div> 

                {section == 0 && (
                    <MyProfile role={role} setData={setFormData} data={formData} loading={loading}/>
                )}
                {section == 1 && (<PersonalData data={formData}/>)}
            </Container>
        </div>
    )
}
