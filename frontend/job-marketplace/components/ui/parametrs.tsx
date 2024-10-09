import { ParameterType } from "@/types/types";

interface Props {
    className ?: string;
    parameters?: ParameterType[];
}

export const Parameters: React.FC<Props> = ({ parameters }) => {
    return (
        <>  
            {parameters?.length ? (
                <>
                    <div className="grid grid-cols-2 gap-2">
                        {parameters.map((parameter) => (
                            <div key={parameter.id} className="flex">
                            <span className="text-common-dark">{parameter.name}:</span>
                            <span className="text-common">&nbsp;{parameter.description}</span>
                        </div>
                        ))}
                    </div>
                </>
            ) : null}
        </>
    );
}