import axios from "axios";
import { Dispatch, SetStateAction } from "react";

export const fetchAvatar = async (setAvatarUrl: Dispatch<SetStateAction<string | null>>) => {
    let accessToken = localStorage.getItem("access_token") || "";
    const storedImageUrl = localStorage.getItem("image_url");

    if(!storedImageUrl) {
        try {
            console.log("Fetching avatar...")
            const response = await axios.get(`http://192.168.0.106:8080/profile/avatar`, {
                headers: {
                  Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
                },
            });
            if (response.status === 200) {
                localStorage.setItem("image_url", response.data.image_url);
                setAvatarUrl(response.data.image_url);
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        setAvatarUrl(storedImageUrl);
        console.log("Avatar fetched from local storage");
    }
}