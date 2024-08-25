import { ClientSession } from "mongoose";
import IEmployeePaperModel from "../../../Model/HR/EmployeePaper/IEmployeePaperModel";
import IEmployeePaperService from "./IEmployeePaperService";
import employeePaperModel from "../../../Model/HR/EmployeePaper/EmployeePaperModel";
import systemError from "../../../Utils/Error/SystemError";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";

class EmployeePaperService implements IEmployeePaperService {
    async addEmployeePaper(paper: IEmployeePaperModel, session: ClientSession): Promise<void> {
        try {
            const newPaper = new employeePaperModel(paper);
            const result = await newPaper.save({ session });
        } catch (error) {
            return systemError.setStatus(402).setMessage(ErrorMessages.COULD_NOT_ADD_EMPLOYEE_PAPER).setData({ error }).throw();
        }
    }
    async editEmployeePaper(_id: string, paper: IEmployeePaperModel): Promise<IEmployeePaperModel | null> {
        const result = await employeePaperModel.findByIdAndUpdate({ _id }, { paper }, { new: true });
        return result;
    }
    async getAllEmployeePaper(name: string | null, department: string | null, limit: number, skip: number): Promise<IEmployeePaperModel[]> {
        const result = await employeePaperModel.aggregate([
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
            ...(name ? [{
                $match: {
                    $or: [
                        { 'employeeData.firstName': { $regex: name, $options: 'i' } },
                        { 'employeeData.lastName': { $regex: name, $options: 'i' } }
                    ]
                }
            }] : []),
            ...(department ? [{
                $match: {
                    'employeeData.department': department
                }
            }] : []),
            {
                $sort: { startDate: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $project: {
                    contractUrl: 1,
                    graduationCertificateUrl: 1,
                    militaryUrl: 1,
                    IdScanUrl: 1,
                    criminalRecordUrl: 1,
                    insuranceUrl: 1,
                    startDate: 1,
                    endDate: 1,
                    employee: {
                        _id: '$employeeData._id',
                        firstName: '$employeeData.firstName',
                        lastName: '$employeeData.lastName',
                        department: '$employeeData.department'
                    }
                }
            }
        ]);
        return result;
    }

}

const employeePaperService = new EmployeePaperService();

export default employeePaperService;