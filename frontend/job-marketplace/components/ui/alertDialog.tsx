import { useEffect, useRef } from "react";
import { Button } from "./button";

interface Props {
    opened: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    description: string;
    onConfirm: () => void;
}



export const AlertDialog: React.FC<Props> = ({ onConfirm, opened, setOpened, title, description }) => {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const openedRef = useRef<boolean>(opened);

    const handleClickOutside = (e: MouseEvent) => {
        if (overlayRef.current && !overlayRef.current.contains(e.target as HTMLElement)) {
            setOpened(false);
        }
    };

    useEffect(() => {
        openedRef.current = opened;

        if (opened) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [opened]);

    return (
        <>
            {opened && (
                <div ref={overlayRef} className="overlay absolute flex items-center justify-center top-64 left-0 right-0">
                    <div className="rounded-lg p-4 bg-non-selected absolute z-30 max-md:max-w-xs md:max-w-lg">
                        <h2 className="text-title-dark">{title}</h2>
                        <p className="text-common mt-2">{description}</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant={"outline"} onClick={() => setOpened(false)}>Скасувати</Button>
                            <Button onClick={onConfirm}>Підтвердити</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
