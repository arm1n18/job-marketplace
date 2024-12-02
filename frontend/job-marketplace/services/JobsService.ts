import FetchDataService from "./FetchDataService";

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
}