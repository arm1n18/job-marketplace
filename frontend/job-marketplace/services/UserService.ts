import axios from "axios";
import JWTService from "./JWTService";

interface UserData {
    url: string;
    setData: (data: any) => void;
    setSelectedData: (data: any) => void;
    setLoading: (loading: boolean) => void;
}

export default class UserService {
    url: string;
    setData: (data: any[]) => void;
    setSelectedData: (data: any) => void;
    private setLoading: (loading: boolean) => void;

    private JWTService: JWTService

    constructor(userData: UserData) {
        this.JWTService = new JWTService();
        this.url = userData.url;
        this.setData = userData.setData;
        this.setSelectedData = userData.setSelectedData;
        this.setLoading = userData.setLoading;
    }

    private async fetchUserData() {
        try {
            const response = await axios.get(`http://192.168.0.106:8080/${this.url}`, {
                headers: {
                    Authorization: this.JWTService.getAccessToken() ? `Bearer ${this.JWTService.getAccessToken()}` : undefined,
                },
                withCredentials: true
            });
    
            this.setData(response.data);
        } catch (error: any) {
            console.log("Error fetching profile:", error);
        }
    }

    public async getUserData() {
        this.setLoading(true);
        const response = await this.fetchUserData();
        this.setLoading(false);
        return response;
    }
}