import axios from "axios";
import JWTService from "./JWTService";
import FetchDataService from "./FetchDataService";
import FormService from "./FormService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { url } from "inspector";

interface Company {
    id?: string | undefined;
    url?: string;
    data?: any;
    params?: URLSearchParams;
    router?: ReturnType<typeof useRouter>;
    redirectURL?: string;
    message?: string;
    setLoading: (loading: boolean) => void;
    setCompany?: any;
    setCompanyJobs?: any;
    setSelectedJob?: (data: any) => void;
}

export default class CompanyService {
    private id: string | undefined;
    private url?: string;
    private params?: URLSearchParams;
    private data?: {[key: string]: string | number | File} | FormData;
    private router?: ReturnType<typeof useRouter>;
    private setLoading?: (loading: boolean) => void;
    private setCompany?: any;
    private setCompanyJobs?: any;
    private setSelectedJob?: (data: any) => void;

    private fetchDataService: FetchDataService
    private SubmitForm: FormService

    constructor(company: Company) {
        this.fetchDataService = new FetchDataService({
            url: `company/${this.url ? this.url: ''}`,
            params: company.params,
            setLoading: company.setLoading,
            setData: company.setCompany,
            setSelectedData: company.setSelectedJob,
          });
        this.SubmitForm = new FormService({
            url: 'company/',
            data: company.data,
            setLoading: company.setLoading,
            router: company.router!,
            message: "Профіль компанії створено успішно",
            redirectURL: 'jobs/create',
        })
        this.data = company.data;
        this.id = company.id;
        this.params = company.params;
        this.router = company.router;
        this.setLoading = company.setLoading;
        this.setCompany = company.setCompany;
        this.setCompanyJobs = company.setCompanyJobs;
        this.setSelectedJob = company.setSelectedJob;
    }

    public async fetchCompanyInfo () {
        try {
            const response = await axios.get(`http://192.168.0.106:8080/company/${this.id}?${this.params?.toString()}`, {
                headers: {
                    Authorization: JWTService.getAccessToken() ? `Bearer ${JWTService.getAccessToken()}` : undefined,
                }, 
            });
            this.setCompany(response.data.company);
            this.setCompanyJobs(response.data.jobs);

            if(response.data.jobs.length > 0 && this.setSelectedJob) {
                this.setSelectedJob(response.data.jobs[0]);
            }
        } catch (err) {
            return JWTService.handleError(err, () => this.fetchCompanyInfo());
        } finally {
            if (this.setLoading) {
                this.setLoading(false);
            }
        }
    };

    public async fetchCompaniesList () {
        this.fetchDataService.getData();
    }

    public async fetchCompanyJobs () {
        this.fetchDataService.getData();
    }

    public async createCompanyProfile() {
        try {
            const response = await axios.post(`http://192.168.0.106:8080/company/`, this.data ,{
                headers: {
                    Authorization: JWTService.getAccessToken() ? `Bearer ${JWTService.getAccessToken()}` : undefined,
                    "Content-Type": "multipart/form-data",
                },            
            });
            
            if(response.status === 200) {
                toast.success("Профіль компанії створено успішно");
                this.SubmitForm.handleRedirect(response.data);
            }

            return response;
        } catch (error: any) {
            return JWTService.handleError(error, () => this.createCompanyProfile());
        }
    }
}