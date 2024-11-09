import axios from "axios";

interface Props {
    url: string;
    params: URLSearchParams;
    setLoading: (loading: boolean) => void;
    setData: (data: any[]) => void;
    setSelectedData: (data: any) => void;
}

const fetchWithRefreshToken = async (url: string, params: URLSearchParams, accessToken: string) => {
    const response = await axios.get(`http://192.168.0.106:8080/auth/refresh-token`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
    });

    localStorage.setItem("access_token", response.data.token);
    
    return await axios.get(`http://192.168.0.106:8080/${url}?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${response.data.token}`,
        },
    });
};

export const fetchData = async ({url, params, setLoading, setData, setSelectedData}: Props) => {
    setLoading(true);
    const accessToken = localStorage.getItem("access_token") || "";

    try {
        const response = await axios.get(`http://192.168.0.106:8080/${url}?${params.toString()}`, {
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
            },
        });

        if (Array.isArray(response.data)) {
            setData(response.data);
            if (response.data.length > 0) {
                setSelectedData(response.data[0]);
            }
        } else {
            setData([]);
        }
    } catch (error: any) {
        if (error.response && error.response.status === 401 && accessToken) {
            try {
                const dataResponse = await fetchWithRefreshToken(url, params, accessToken);
                setData(dataResponse.data);
                if (dataResponse.data.length > 0) {
                    setSelectedData(dataResponse.data[0]);
                }
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                setData([]);
            }
        } else {
            console.error("Fetch data error:", error);
            setData([]);
        }
    } finally {
        setLoading(false);
    }
};
