import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Role } from "@/components/hook/AuthContext";

interface AuthData {
    data: {[key: string]: string};
    router: ReturnType<typeof useRouter>;
}

interface SetAuthData {
    setLoggedIn: (value: boolean) => void;
    setRole: (value: string) => void;
    setId: (value: number) => void;    
    setEmail: (value: string) => void;
}

export default class AuthService {
    authData: {[key: string]: string};
    setAuthData: SetAuthData;
    private router: ReturnType<typeof useRouter>;
    private setLoggedIn:(value: boolean) => void;

    constructor(AuthData: AuthData, setAuthData: SetAuthData) {
        this.authData = AuthData.data;
        this.setAuthData = setAuthData;
        this.router = AuthData.router;
        this.setLoggedIn = setAuthData.setLoggedIn
    }

    private async Login(authData: any) {
        try {
            const response = await axios.post(`http://192.168.0.106:8080/auth/login`, authData, {
                withCredentials: true,
            });

            if (response.status === 200) {
                this.setAccessToken(response);
                this.setLoggedIn(this.decodeToken(response) != null)
                this.setDataFromToken(this.decodeToken(response));
                toast.success('Успішний вхід');
                this.handleRedirect(response);
                return { success: true, data: response.data };
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                return { success: false, error: err.response.data.error || 'Невідома помилка'};
                
            } else {
                return { success: false, error: 'Невідома помилка' };
            }
        }
    }

    private async Register(authData: any) {
        try {
            const response = await axios.post(`http://192.168.0.106:8080/auth/register`, authData, {
                withCredentials: true,
            });
            if (response.status === 200) {
                toast.success('Успішна реєстрація');
                this.setAccessToken(response);
                console.log("Token from localStorage:", response.data.token);
                if(this.decodeToken(response).role === 'CANDIDATE') {
                    this.router.push('/candidates/create');
                } else if (this.decodeToken(response).role === 'RECRUITER') {
                    this.router.push('/company/create');
                }
                return { success: true, data: response.data };
            }
        }catch (err) {
            toast.warning((err as Error).toString());
            return { success: false, error: (err as Error).toString() };
        }
    }

    private setAccessToken(response: any) {
        localStorage.setItem('access_token', response.data.token);
    }

    private decodeToken(response: any) {
        return jwtDecode<Role>(response.data.token);
    }

    private setDataFromToken(decodedToken: any) {
        const { setLoggedIn, setRole, setId, setEmail } = this.setAuthData;

        setRole(decodedToken.role);
        setId(decodedToken.id);
        setEmail(decodedToken.email);
        setLoggedIn(true);
    }

    private handleRedirect(data: any) {
        if(this.decodeToken(data).role === 'CANDIDATE') {
            this.router.push(`/jobs`);
        } else if(this.decodeToken(data).role === 'RECRUITER'){
            this.router.push(`/candidates`);
        }
    }

    public async loginUser() {
        return await this.Login(this.authData);
    }

    public async registerUser() {
        return await this.Register(this.authData);
    }
}
