import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import JWTService from "./JWTService";

interface FormData {
    url: string;
    redirectURL?: string;
    data: any;
    setLoading: any;
    router: ReturnType<typeof useRouter>;
    message: string;
}

export default class FormService {
    public url: string;
    private redirectURL?: string;
    private data: any;
    public setLoading: any;
    private router: ReturnType<typeof useRouter>;
    private message: string;

    constructor(FormData: FormData) {
        this.url = FormData.url;
        this.redirectURL = FormData.redirectURL;
        this.data = FormData.data;
        this.setLoading = FormData.setLoading;
        this.router = FormData.router;
        this.message = FormData.message;
    }

    private async sendForm() {
        try {
            const response = await axios.post(`http://192.168.0.106:8080/${this.url}`, this.data ,{
                headers: {
                    Authorization: JWTService.getAccessToken() ? `Bearer ${JWTService.getAccessToken()}` : undefined,
                    "Content-Type": "application/json",
                },            
            });
            
            if(response.status === 200) {
                toast.success(this.message);
                this.handleRedirect(response.data);
            }

            return response;
        } catch (error: any) {
            return JWTService.handleError(error, () => this.sendForm());
        }
    }

    private async sendUpdatedForm() {
        try {
            const response = await axios.put(`http://192.168.0.106:8080/${this.url}`, this.data ,{
                headers: {
                    Authorization: JWTService.getAccessToken() ? `Bearer ${JWTService.getAccessToken()}` : undefined,
                    "Content-Type": "application/json",
                },            
            });
            
            if(response.status === 200) {
                toast.success(this.message);
                this.handleRedirect(response.data);
            }

            return response;
        } catch (error: any) {
            return JWTService.handleError(error, () => this.sendUpdatedForm());
        }
    }

    public handleRedirect(data: any) {
        if(data.id) {
            this.router.push(`/${this.redirectURL}/${data.id}`);
        } else {
            this.router.push(`/${this.redirectURL}`);
        }
    }

    public async submitForm() {
        this.setLoading(true);
        const response = await this.sendForm();
        this.setLoading(false);
        return response;
    }

    public async submitUpdatedForm() {
        this.setLoading(true);
        const response = await this.sendUpdatedForm();
        this.setLoading(false);
        return response;
    }
}