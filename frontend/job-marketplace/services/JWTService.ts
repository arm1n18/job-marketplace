import axios from "axios";
import { toast } from "react-toastify";

export default class JWTService {
    private retryCount = 0;

    public getAccessToken() {
        return localStorage.getItem("access_token") ?? ""
    }

    public async handleError(error: any, retryRequest: Function) {
        if(error.response) {
            if(error.response.status === 409) {
                toast.warning(error.response?.data.message);
            }
            if(error.response.status === 401 && this.getAccessToken()) {
                // console.log("Token expired, refreshing...");
                if (this.retryCount < 2) {
                    this.retryCount++;
                    const refreshResponse = await this.refreshAccessToken();
                    if(refreshResponse) {
                        return retryRequest();
                    }
                }
            } else {
                toast.warning(error.response?.data.message);
            }
        }
    }

    private async refreshAccessToken() {
        // console.log("Old Token:", this.getAccessToken());
        try {
            const response = await axios.get(`http://192.168.0.106:8080/auth/refresh-token`, {
                headers: {
                    Authorization: `Bearer ${this.getAccessToken()}`,
                },
                withCredentials: true,
            });
            if (response.data && response.data.token) {
                console.log("New Token:", response.data.token);
                localStorage.setItem("access_token", response.data.token);
                this.retryCount = 0;
            }
            return response;
        } catch (error) {
            toast.warning("Помилка оновлення токену");
            return null;
        }
    }
}