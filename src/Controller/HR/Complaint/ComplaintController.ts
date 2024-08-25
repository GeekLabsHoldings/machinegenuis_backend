import IComplaintModel from "../../../Model/HR/Complaint/IComplaintModel";
import complaintService from "../../../Service/HR/Complaint/ComplaintService";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import IComplaintController from "./IComplaintController";

export default class ComplaintController implements IComplaintController {
    async createComplaint(complaint: IComplaintModel): Promise<IComplaintModel> {
        return await complaintService.createComplaint(complaint);
    }
    async getAllComplaints(name: string | null, department: string | null, urgencyLevel: string | null, solved: boolean, limit: number, skip: number): Promise<IComplaintModel[]> {
        return await complaintService.getAllComplaints(name, department, urgencyLevel, solved,limit,skip);
    }
    async getOneComplaint(_id: string): Promise<IComplaintModel> {
        const result = await complaintService.getOneComplaint(_id)
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.COMPLAINT_NOT_FOUND).throw();
        return result;
    }
    async solveComplaint(_id: string): Promise<IComplaintModel> {
        const result = await complaintService.solveComplaint(_id)
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.COMPLAINT_NOT_FOUND).throw();
        return result;
    }

}