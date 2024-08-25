import IEmployeeModel from "../../../Model/Employee/IEmployeeModel";

export default interface IEmployeeController {
    getAllEmployee(name: string | null, department: string | null, limit: number, skip: number): Promise<IEmployeeModel[]>;
}