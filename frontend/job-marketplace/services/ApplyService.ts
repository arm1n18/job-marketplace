import { Method, ResponseDataType } from "@/types/response.type";
import axios from "axios";
import { toast } from "react-toastify";
import JWTService from "./JWTService";

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

    public async respondTo() {
        console.log(this.data);
        try {
            const response = await axios.post(`http://192.168.0.106:8080/response/`, this.data, {
                headers: {
                    Authorization: JWTService.getAccessToken() ? `Bearer ${JWTService.getAccessToken()}` : undefined,
                },
                withCredentials: true,
            });

            if(response.status === 200) {
                return { success: true};
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.warning(error.response.data.error);
                return JWTService.handleError(error, () => this.respondTo);
            }
        }
        
    }

    public async respond() {

        if(this.role === "CANDIDATE" && this.data.method as Method) {
            const response = await this.respondTo();
            return response;
        } else if(this.role === "RECRUITER" && this.data.method as Method) {
            const response = await this.respondTo();
            return response;
        }
    }
}