import { ClientSession } from "mongoose";
import IEmployeePaperModel from "../../../Model/HR/EmployeePaper/IEmployeePaperModel";

export default interface IEmployeePaperService {
    addEmployeePaper(paper: IEmployeePaperModel, session: ClientSession): Promise<void>;
    editEmployeePaper(_id: string, paper: IEmployeePaperModel): Promise<IEmployeePaperModel | null>;
    getAllEmployeePaper(name: string | null, department: string | null, limit: number, skip: number): Promise<IEmployeePaperModel[]>;
}