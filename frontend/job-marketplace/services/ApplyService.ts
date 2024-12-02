import { Method, ResponseDataType } from "@/types/response.type";
import axios from "axios";
import { toast } from "react-toastify";

interface ApplyType {
    role: "CANDIDATE" | "RECRUITER";
    data: ResponseDataType;
    jobID?: number | undefined;
    resumeID?: number;
}

export default class ApplyService {
    private role: "CANDIDATE" | "RECRUITER";
    private data: ResponseDataType;
    
    constructor(ApplyType: ApplyType) {
        this.role = ApplyType.role;
        this.data = ApplyType.data;

    }

    public getAccessToken() {
        return localStorage.getItem("access_token") ?? ""
    }

    public async respondTo() {
        try {
            const response = await axios.post(`http://192.168.0.106:8080/response`, this.data, {
                headers: {
                    Authorization: this.getAccessToken() ? `Bearer ${this.getAccessToken()}` : undefined,
                },
                withCredentials: true,
            });

            if(response.status === 200) {
                return { success: true};
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.warning(error.response.data.message);
                return { success: false };
            }
        }
        
    }

    public async respond() {

        if(this.role === "CANDIDATE" && this.data.method as Method) {
            await this.respondTo();
            return { success: true};
        } else if(this.role === "RECRUITER" && this.data.method as Method) {
            await this.respondTo();
            return { success: true};
        }
        return { success: false};
    }
}