import FormService from "@/services/FormService";
import { FormSubmit } from "@/types";
import { toast } from "react-toastify";

export const useFormUpdate = async (props: FormSubmit) : Promise<void> => {
    const { url, dataToSend, router, validationZod, setErrors, message, redirectURL, isDataChanged } = props;
    const result  = validationZod.safeParse(dataToSend);
    if (!isDataChanged) {
        toast.warn("Нічого не змінено!");
        return
    }
    if(!result.success) {
        const formErrors: { [key: string]: string} = {};
        result.error.errors.forEach((error: { path: string[], message: string }) => {
            formErrors[error.path[0]] = error.message;
        })
        if(dataToSend.salary_from > dataToSend.salary_to) setErrors((prevErrors) => ({ ...prevErrors, salary_to: "Початкова зарплата не може бути більшою за кінцеву" }));
        if(dataToSend.employment_name === "") setErrors((prevErrors) => ({ ...prevErrors, employment_name: "Оберіть формат роботи" }));
        if(dataToSend.category_name === "") setErrors((prevErrors) => ({ ...prevErrors, category_name: "Оберіть категорію" }));
        setErrors(formErrors);
        return;
    }
    try {
        const formService = new FormService({
            url: url,
            data: dataToSend,
            setLoading: () => {},
            router: router,
            message: message,
            redirectURL: redirectURL,
        })
        await formService.submitUpdatedForm();

    } catch (err) {
        console.error("Помилка при створенні:", err);
    }
}