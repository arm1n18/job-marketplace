import { useEffect } from "react"

interface Props {
    isOpen: boolean,
    setIsOpen: (newOpen: boolean) => void,
    openedRef: React.RefObject<HTMLDivElement>
}

export const useOpenedRef = ({isOpen, setIsOpen, openedRef}: Props) => {
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(isOpen && openedRef.current && !openedRef.current.contains(e.target as HTMLElement)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

    }, [isOpen])
}