import { ClientSession } from "mongoose";
import employeeModel from "../../Model/Employee/EmployeeModel";
import IEmployeeModel from "../../Model/Employee/IEmployeeModel";
import { IEmployeeService } from "./IEmployeeService";
import systemError from "../../Utils/Error/SystemError";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";

class EmployeeService implements IEmployeeService {

    async addEmployee(employee: IEmployeeModel, session: ClientSession): Promise<IEmployeeModel> {
        try {
            const newEmployee = new employeeModel(employee);
            const result = await newEmployee.save({ session });
            return result;
        } catch (error) {
            return systemError.setStatus(406).setMessage(ErrorMessages.CAN_NOT_CREATE_EMPLOYEE).setData({ error }).throw();
        }
    }
    async getOneEmployee(_id: string): Promise<IEmployeeModel | null> {
        const employee = await employeeModel.findById(_id)
            .populate({
                path: 'role'
            })
            .select({ firstName: 1, lastName: 1, email: 1, phoneNumber: 1, department: 1, role: 1, type: 1, token: 1 });
        return employee;
    }

    async getAllEmployee(name: string | null, department: string | null, limit: number, skip: number): Promise<IEmployeeModel[]> {
        const query = employeeModel.find()
            .populate({
                path: 'role'
            })
            .select({ firstName: 1, lastName: 1, email: 1, phoneNumber: 1, department: 1, role: 1, type: 1, cv: 1, linkedIn: 1 }).sort({ createdAt: 1 }).skip(skip).limit(limit)
        if (name) {
            query.where({
                $or: [
                    { firstName: { $regex: name, $options: 'i' } },
                    { lastName: { $regex: name, $options: 'i' } }
                ]
            })
        }
        if (department) {
            query.where({
                department: {
                    $elemMatch: { $eq: department }
                }
            })
        }
        const result = await query.exec()
        return result;
    }
}

const employeeService = new EmployeeService();

export default employeeService;