import { toast } from "react-toastify";
import FetchDataService from "./FetchDataService";
import axios from "axios";
import JWTService from "./JWTService";

interface Job {
    url: string;
    params?: URLSearchParams;
    setLoading: (loading: boolean) => void;
    setData: any;
    setSelectedData?: (data: any) => void;
}

export default class JobsService {
    private url: string;
    setJobs: any;
    setSelectedData?: (data: any) => void;

    private fetchDataService: FetchDataService

    constructor(job: Job) {
        this.url = job.url;
        this.setJobs = job.setData;
        this.setSelectedData = job.setSelectedData;
        this.fetchDataService = new FetchDataService({
            url: this.url,
            params: job.params,
            setLoading: job.setLoading,
            setData: job.setData,
            setSelectedData: job.setSelectedData
        });
    }

    public async fetchJobs() {
        this.fetchDataService.getData();
    }

    public async fetchJobByID() {
        this.fetchDataService.getData();
    }

    public static async deleteJob(id: number) {
        try {
            const response = await axios.delete(`http://192.168.0.106:8080/jobs/${id}`, {
                headers: {
                    Authorization: JWTService.getAccessToken() ? `Bearer ${JWTService.getAccessToken()}` : undefined,
                },
            });
            if(response.status === 200) {
                toast.success('Вакансію успішно видалено');
            }
        } catch (error) {
            return JWTService.handleError(error, () => this.deleteJob(id));
        }
    }
}