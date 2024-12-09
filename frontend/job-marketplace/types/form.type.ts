import { useRouter } from "next/navigation";

export interface FormSubmit {
    e: React.FormEvent<HTMLFormElement>;
    url: string;
    redirectURL?: string;
    dataToSend: {[key: string]: string | number | File};
    setLoading: (loading: boolean) => void;
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    validationZod: any;
    router: ReturnType<typeof useRouter>;
    message: string;
}