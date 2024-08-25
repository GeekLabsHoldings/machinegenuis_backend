import IComplaintModel from "../../../Model/HR/Complaint/IComplaintModel";

export default interface IComplaintController {
    createComplaint(complaint: IComplaintModel): Promise<IComplaintModel>;
    getAllComplaints(name: string | null, department: string | null, urgencyLevel: string | null, solved: boolean, limit: number, skip: number): Promise<IComplaintModel[]>;
    getOneComplaint(_id: string): Promise<IComplaintModel>;
    solveComplaint(_id: string): Promise<IComplaintModel>;
}