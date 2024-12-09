import { toast } from "react-toastify";

export const copyURL = (url: string) => {
    if(navigator.clipboard) navigator.clipboard.writeText(url);
    else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }
    toast.success("Скопійовано до буфера");
}