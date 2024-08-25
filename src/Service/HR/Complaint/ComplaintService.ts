import { PipelineStage } from "mongoose";
import complaintModel from "../../../Model/HR/Complaint/ComplaintModel";
import IComplaintModel from "../../../Model/HR/Complaint/IComplaintModel";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import IComplaintService from "./IComplaintService";

class ComplaintService implements IComplaintService {
    async createComplaint(complaint: IComplaintModel): Promise<IComplaintModel> {
        try {
            const newComplaint = new complaintModel(complaint);
            const result = await newComplaint.save();
            return result;
        } catch (error) {
            return systemError.setStatus(406).setMessage(ErrorMessages.CAN_NOT_CREATE_COMPLAINT).setData({ error }).throw()
        }
    }
    async getAllComplaints(name: string | null, department: string | null, urgencyLevel: string | null, solved: boolean, limit: number, skip: number): Promise<IComplaintModel[]> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    solved: { $eq: solved },
                    ...(urgencyLevel ? { urgencyLevel: { $eq: urgencyLevel } } : {})
                }
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employee',
                    foreignField: '_id',
                    as: 'employeeData'
                }
            },
            {
                $unwind: {
                    path: '$employeeData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    ...(name ? {
                        $or: [
                            { 'employeeData.firstName': { $regex: name, $options: 'i' } },
                            { 'employeeData.lastName': { $regex: name, $options: 'i' } }
                        ]
                    } : {}),
                    ...(department ? {
                        'employeeData.department': {
                            $elemMatch: { $eq: department }
                        }
                    } : {})
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $project: {
                    complaintIssue: 1,
                    description: 1,
                    urgencyLevel: 1,
                    createdAt: 1,
                    employee: {
                        _id: '$employeeData._id',
                        firstName: '$employeeData.firstName',
                        lastName: '$employeeData.lastName',
                        department: '$employeeData.department',
                        theme: '$employeeData.theme'
                    }
                }
            }
        ]
        const result = await complaintModel.aggregate(pipeline);
        return result;
    }
    async getOneComplaint(_id: string): Promise<IComplaintModel | null> {
        return await complaintModel.findById(_id).populate({
            path: 'employee',
            select: { _id: 1, firstName: 1, lastName: 1, department: 1, theme: 1 }
        });
    }

    async solveComplaint(_id: string): Promise<IComplaintModel | null> {
        return await complaintModel.findByIdAndUpdate(_id, { solved: true }, { new: true });
    }

}

const complaintService = new ComplaintService();
export default complaintService;