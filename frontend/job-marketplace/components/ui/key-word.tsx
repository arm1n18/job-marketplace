interface Props {
    keyword : string;
    className ?: string;
}

export const KeyWord: React.FC<Props> = ({keyword, className }) => {
    return (
        <>  
            <div className={className}>
                {keyword}
            </div>
        </>
    )
}