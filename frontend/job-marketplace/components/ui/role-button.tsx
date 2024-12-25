interface Props {
    role: string;
    isSelected: boolean;
    onClick: () => void;
    className ?: string;
}

export const RoleButton: React.FC<Props> = ({role, isSelected, onClick}) => {
    return (
        <>  
            <div
            className={`flex max-sm:w-40 w-60 justify-center rounded-lg items-center h-24 ${isSelected ? 'bg-[#F7F7F8]' : 'bg-transparent'} cursor-pointer`}
            onClick={onClick}>
                <p className="text-title-dark mx-auto">{role}</p>
            </ div>
        </>
    )
}