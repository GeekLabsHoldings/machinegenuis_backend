import { ClientSession, Types } from "mongoose";
import IEmployeeModel from "../../../Model/Employee/IEmployeeModel";
import IEmployeePaperModel from "../../../Model/HR/EmployeePaper/IEmployeePaperModel";
import employeeService from "../../../Service/Employee/EmployeeService";
import IEmployeeController from "./IEmployeeController";
import candidateService from "../../../Service/HR/Candidate/CandidateService";
import systemError from "../../../Utils/Error/SystemError";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import { EmployeeTypeEnum } from "../../../Utils/employeeType";
import moment from "moment-timezone";
import employeePaperService from "../../../Service/HR/EmployeePaper/EmployeePaperService";
import EmailController from "../../Messages/EmailController";
import { generateWelcomeEmail, HiringEmailEnum } from "../../../Utils/Message";
import authenticationService from "../../../Service/Authentication/AuthenticationService";
import IPayrollModel from "../../../Model/Accounting/Payroll/IPayrollModel";
import PayrollService from "../../../Service/Accounting/Payroll/PayrollService";

export default class EmployeeController implements IEmployeeController {
    async convertCandidateToEmployee(
        employer_id: string, _id: string, paper: IEmployeePaperModel, email: string,
        password: string, birthday: number, theme: string, payroll: IPayrollModel,
        session: ClientSession): Promise<IEmployeeModel> {
        const candidate = await candidateService.getCandidate(_id, session);
        if (!candidate)
            return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_NOT_FOUND).throw();
        const hasPassword = await authenticationService.hashPassword(password);
        const employeeData: IEmployeeModel = {
            createdBy: new Types.ObjectId(employer_id),
            phoneNumber: candidate.phoneNumber,
            cv: candidate.cvLink,
            personalEmail: candidate.email,
            _id: new Types.ObjectId(_id),
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: email,
            password: hasPassword,
            type: EmployeeTypeEnum.USER,
            department: [candidate.department],
            role: candidate.role,
            createdAt: moment().valueOf(),
            theme: theme,
            token: "",
            linkedIn: candidate.linkedIn,
            birthday
        }
        const convertToEmployee = await employeeService.addEmployee(employeeData, session);
        paper.employee = (convertToEmployee._id) as Types.ObjectId;
        await employeePaperService.addEmployeePaper(paper, session);
        payroll.employee = convertToEmployee._id;
        const payrollService = new PayrollService();
        await payrollService.createPayroll(payroll, session);
        const emailController = new EmailController(session);
        const message = generateWelcomeEmail(email, password);
        await emailController.sendEmail(candidate.email, HiringEmailEnum.WELCOME_MESSAGE, message);
        return convertToEmployee;
    }
    async getAllEmployee(name: string | null, department: string | null, limit: number, skip: number): Promise<IEmployeeModel[]> {
        return await employeeService.getAllEmployee(name, department, limit, skip);
    }

}
