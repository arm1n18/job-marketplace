import axios from "axios";

export const checkAuth = async () => {
    try {
        const response = await axios.get(`http://192.168.0.106:8080/auth/check`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            // withCredentials: true,
        });
        return response.status === 200;
    } catch (error) {
        console.error("Помилка перевірки автентификації:", error);
        return false;
    }
};
