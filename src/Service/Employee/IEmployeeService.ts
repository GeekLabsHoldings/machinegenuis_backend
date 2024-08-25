import { ClientSession } from "mongoose";
import IEmployeeModel from "../../Model/Employee/IEmployeeModel";

export interface IEmployeeService {
    addEmployee(employee: IEmployeeModel, session: ClientSession): Promise<IEmployeeModel>;
    getOneEmployee(_id: string): Promise<IEmployeeModel | null>;
    getAllEmployee(name: string | null, department: string | null, limit: number, skip: number): Promise<IEmployeeModel[]>;
}