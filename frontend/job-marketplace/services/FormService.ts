import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import JWTService from "./JWTService";

interface FormData {
    url: string;
    redirectURL?: string;
    data: {[key: string]: string | number | File} | FormData;
    setLoading: any;
    router: ReturnType<typeof useRouter>;
    message: string;
}

export default class FormService {
    public url: string;
    private redirectURL?: string;
    private data: {[key: string]: string | number | File} | FormData;
    private setLoading: any;
    private router: ReturnType<typeof useRouter>;
    private message: string;

    private JWTService: JWTService

    constructor(FormData: FormData) {
        this.JWTService = new JWTService();
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
                    Authorization: this.JWTService.getAccessToken() ? `Bearer ${this.JWTService.getAccessToken()}` : undefined,
                },            
            });
            
            if(response.status === 200) {
                toast.success(this.message);
                this.handleRedirect(response.data);
            }

            return response;
        } catch (error: any) {
            return this.JWTService.handleError(error, () => this.sendForm());
        }
    }

    
    private handleRedirect(data: any) {
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
    
}