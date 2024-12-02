import axios from "axios";
import JWTService from "./JWTService";

interface FetchData {
    url: string;
    doubleData?: boolean;
    params?: URLSearchParams;
    setLoading: (loading: boolean) => void;
    setData: any;
    setSelectedData?: (data: any) => void;
}

export default class FetchDataService {
    private url: string;
    private doubleData?: boolean;
    private params?: URLSearchParams;
    private setLoading: (loading: boolean) => void;
    private setData: any;
    private setSelectedData?: (data: any) => void;


    private JWTService: JWTService
    
    constructor(fetchData: FetchData) {
        this.JWTService = new JWTService();
        this.url = fetchData.url;
        this.doubleData = fetchData.doubleData;
        this.params = fetchData.params;
        this.setLoading = fetchData.setLoading;
        this.setData = fetchData.setData;
        this.setSelectedData = fetchData.setSelectedData;
    }

    private async fetchData() {
        try {
            let fullUrl = `http://192.168.0.106:8080/${this.url}`
            if (this.params) {
                fullUrl += `?${this.params.toString()}`;
            }
            const response = await axios.get(fullUrl, {
                headers: {
                    Authorization: this.JWTService.getAccessToken() ? `Bearer ${this.JWTService.getAccessToken()}` : undefined,
                },  
            });
            

            if(this.doubleData) {
                if (this.setSelectedData) {
                    const dataArray = Object.values(response.data).find((value) => Array.isArray(value));
                    this.setData(response.data);
                    if (dataArray && dataArray.length > 0) {
                        this.setSelectedData(dataArray[0]);
                    }
                    } else {
                    this.setData(response.data);
                }
            } else {
                if(this.setSelectedData) {
                    if (Array.isArray(response.data)) {
                        this.setData(response.data);
                            if (response.data.length > 0) {
                                this.setSelectedData(response.data[0]);
                                
                        }
                    } else {
                        this.setData([]);
                    }
                } else {
                    this.setData(response.data);
                }
            }
        } catch (error: any) {
            return this.JWTService.handleError(error, () => this.fetchData());
        }
    }

    public async getData() {
        this.setLoading(true);
        const response = await this.fetchData();
        this.setLoading(false);
        return response;
    }
}