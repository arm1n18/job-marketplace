export type Method = "applyForJob" | "applyForResume" | "rejectResume" | "rejectJob" | "acceptJob" | "acceptResume";


export interface ResponseDataType {
    method: Method;
    applyingForID: number;
    recruiterID: number;
    candidateID: number;
    jobID?: number
}