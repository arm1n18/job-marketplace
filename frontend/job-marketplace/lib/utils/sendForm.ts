import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

interface Props {
    url: string;
    redirectURL?: string;
    data: {[key: string]: string | number | File} | FormData;
    setLoading: any;
    router: ReturnType<typeof useRouter>;
    message: string;
}

export const sendForm = async ({url, redirectURL, data, setLoading, router, message}: Props) => {
    setLoading(true);

    let accessToken = localStorage.getItem("access_token") || "";
    try {
        const response = await axios.post(`http://192.168.0.106:8080/${url}`, data ,{
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
            },            
        });
        if(response.status === 200) {
            toast.success(message);
            if(response.data.id) {
                router.push(`/${redirectURL}/${response.data.id}`);
            } else {
                router.push(`/${redirectURL}`);
            }
        }
        return response;
    } catch (error: any) {
        
        
    }
};