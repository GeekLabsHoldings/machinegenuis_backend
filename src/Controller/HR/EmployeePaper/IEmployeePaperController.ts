import IEmployeePaperModel from "../../../Model/HR/EmployeePaper/IEmployeePaperModel";

export default interface IEmployeePaperController {
    editEmployeePaper(_id: string, paper: IEmployeePaperModel): Promise<IEmployeePaperModel>;
    getAllEmployeePaper(name: string | null, department: string | null, limit: number, skip: number): Promise<IEmployeePaperModel[]>;
}