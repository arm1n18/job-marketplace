import { toast } from "react-toastify";
import FetchDataService from "./FetchDataService";
import axios from "axios";
import JWTService from "./JWTService";
import JobsService from "./JobsService";

interface Job {
    url: string;
    params?: URLSearchParams;
    setLoading: (loading: boolean) => void;
    setData: any;
    setSelectedData?: (data: any) => void;
}

export default class ResumeService {
    private url: string;
    setResumes: any;
    setSelectedData?: (data: any) => void;

    private fetchDataService: FetchDataService

    constructor(job: Job) {
        this.url = job.url;
        this.setResumes = job.setData;
        this.setSelectedData = job.setSelectedData;
        this.fetchDataService = new FetchDataService({
            url: this.url,
            params: job.params,
            setLoading: job.setLoading,
            setData: job.setData,
            setSelectedData: job.setSelectedData
        });
    }

    public async fetchResumes() {
        this.fetchDataService.getData();
    }

    public async fetchResumeByID() {
        this.fetchDataService.getData();
    }

    public static async deleteResume(id: number) {
        try {
            const response = await axios.delete(`http://192.168.0.106:8080/candidates/${id}`, {
                headers: {
                    Authorization: JWTService.getAccessToken() ? `Bearer ${JWTService.getAccessToken()}` : undefined,
                },
            });
            if(response.status === 200) {
                toast.success('Резюме успішно видалено');
            }
        } catch (error) {
            return JWTService.handleError(error, () => this.deleteResume(id));
        }
    }

    public static formatExperience(experience: number): string {
        return JobsService.formattedExperience(experience);
    }
}