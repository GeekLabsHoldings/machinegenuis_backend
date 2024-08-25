import IEmployeePaperModel from "../../../Model/HR/EmployeePaper/IEmployeePaperModel";
import employeePaperService from "../../../Service/HR/EmployeePaper/EmployeePaperService";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import IEmployeePaperController from "./IEmployeePaperController";

export default class EmployeePaperController implements IEmployeePaperController {
    async editEmployeePaper(_id: string, paper: IEmployeePaperModel): Promise<IEmployeePaperModel> {
        const result = await employeePaperService.editEmployeePaper(_id, paper);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.CAN_NOT_FOUND_EMPLOYEE_PAPER).throw();
        return result;
    }
    async getAllEmployeePaper(name: string | null, department: string | null, limit: number, skip: number): Promise<IEmployeePaperModel[]> {
        const result = await employeePaperService.getAllEmployeePaper(name, department, limit, skip);
        return result;
    }

}