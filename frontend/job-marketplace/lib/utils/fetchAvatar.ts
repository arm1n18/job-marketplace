import axios from "axios";
import { Dispatch, SetStateAction } from "react";

export const fetchAvatar = async (setAvatarUrl: Dispatch<SetStateAction<string | null>>, role: string) => {
    const accessToken = localStorage.getItem("access_token") || "";
    const storedImageUrl = localStorage.getItem("image_url");

    if(!storedImageUrl && role == "RECRUITER") {
        try {
            const response = await axios.get(`http://192.168.0.106:8080/user/avatar`, {
                headers: {
                  Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
                },
            });
            if (response.status === 200) {
                localStorage.setItem("image_url", response.data.image_url);
                setAvatarUrl(response.data.image_url);
            }
            console.log("Fetching avatar...");
        } catch (error) {
            setAvatarUrl(null);
            console.error("Error fetching avatar:", error);
        }
    } else {
        setAvatarUrl(storedImageUrl);
    }
}