import { sendForm } from "./sendForm";
import { useRouter } from "next/navigation";

interface FormSubmitProps {
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

export const useFormSubmit = async (props: FormSubmitProps) : Promise<void> => {
    const { e, url, dataToSend, router, validationZod, setErrors, message, redirectURL } = props;
    // e.preventDefault();
    const result  = validationZod.safeParse(dataToSend);
    if(!result.success) {
        const formErrors: { [key: string]: string} = {};
        result.error.errors.forEach((error: { path: string[], message: string }) => {
            formErrors[error.path[0]] = error.message;
        })
        setErrors(formErrors);
        if(dataToSend.salary_from > dataToSend.salary_to) setErrors((prevErrors) => ({ ...prevErrors, salary_to: "Початкова зарплата не може бути більшою за кінцеву" }));
        if(dataToSend.employment_name === "") setErrors((prevErrors) => ({ ...prevErrors, employment_name: "Оберіть формат роботи" }));
        if(dataToSend.category_name === "") setErrors((prevErrors) => ({ ...prevErrors, category_name: "Оберіть категорію" }));
        return;
    }
    try {
        sendForm({url: url, data: dataToSend, setLoading: () => {}, router, message, redirectURL: redirectURL});

    } catch (err) {
        console.error("Помилка при створенні:", err);
    }
}