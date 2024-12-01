export type Method = "applyForJob" | "applyForResume" | "cancleResume" | "cancleJob" | "acceptJob" | "acceptResume";


export interface ResponseDataType {
    method: Method;
    applyingForID: number;
    recruiterID: number;
    candidateID: number;
    jobID?: number
}