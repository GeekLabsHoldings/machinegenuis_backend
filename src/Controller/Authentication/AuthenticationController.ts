import { ClientSession } from "mongoose";
import authenticationService from "../../Service/Authentication/AuthenticationService";
import AuthenticationControllerInterface from "./IAuthenticationController";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import attendanceService from "../../Service/HR/Attendance/AttendanceService";
import moment, { CheckIsLateTime, EndOfDay, StartOfDay } from "../../Utils/DateAndTime";
import systemError from "../../Utils/Error/SystemError";
import IEmployeeModel from "../../Model/Employee/IEmployeeModel";

class AuthenticationController implements AuthenticationControllerInterface {
    session: ClientSession;
    constructor(session: ClientSession) {
        this.session = session;
    }
    async login(email: string, password: string): Promise<string> {
        const employee = await authenticationService.getEmployeeByEmail(email, this.session);
        if (!employee)
            return systemError.setStatus(404).setMessage(ErrorMessages.INVALID_CREDENTIALS).throw();
        const comparePassword = await authenticationService.comparePassword(password, employee.password);
        if (!comparePassword)
            return systemError.setStatus(404).setMessage(ErrorMessages.INVALID_CREDENTIALS).throw();

        const token = authenticationService.createJWT(employee)
        const saveToken = await authenticationService.saveToken((employee._id) as string, token, this.session);
        if (!saveToken)
            return systemError.setStatus(406).setMessage(ErrorMessages.ERROR_WHEN_SAVE_TOKEN).throw();
        const checkedIn = moment();
        const startOfDay = StartOfDay(checkedIn);
        const endOfDay = EndOfDay(checkedIn);
        const checkAttend = await attendanceService.checkAttend((employee._id) as string, startOfDay, endOfDay, this.session);
        console.log({ checkAttend });
        if (!checkAttend) {
            const warning = CheckIsLateTime(checkedIn);
            const attend = await attendanceService.checkedIn((employee._id) as string, checkedIn.valueOf(), warning, this.session);
            if (!attend)
                return systemError.setStatus(406).setMessage(ErrorMessages.ERROR_WHEN_ATTEND_EMPLOYEE).throw();
        }
        return token;

    }
    async logout(employeeId: string): Promise<void> {
        const checkedOut = moment();
        const startOfDay = StartOfDay(checkedOut);

        const deleteToken = await authenticationService.deleteToken(employeeId, this.session);
        if (!deleteToken)
            return systemError.setStatus(404).setMessage(ErrorMessages.EMPLOYEE_NOT_FOUND).throw();

        const checkedOutStatus = await attendanceService.checkedOut(employeeId, startOfDay, checkedOut.valueOf(), this.session);
        if (!checkedOutStatus)
            return systemError.setStatus(406).setMessage(ErrorMessages.LOGOUT_NOTE_VERIFY).throw();
    }

}


export default AuthenticationController;