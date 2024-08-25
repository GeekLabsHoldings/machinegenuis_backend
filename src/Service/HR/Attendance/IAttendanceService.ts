import { ClientSession, Types } from "mongoose";
import IAttendanceModel from "../../../Model/HR/Attendance/IAttendanceModel";

export interface ICountAttendanceWarning {
    employee: string,
    warning: number
}
export default interface IAttendanceService {
    checkAttend(employeeId: string, startOfDay: number, endOfDay: number, session: ClientSession): Promise<boolean>
    checkedIn(employeeId: string, checkedIn: number, warning: boolean, session: ClientSession): Promise<boolean>;
    checkedOut(employeeId: string, startOfDay: number, checkedOut: number, session: ClientSession): Promise<boolean>;
    //excuseAttendance(attendanceId:string,session:ClientSession):Promise<boolean>;
    getAllWarningAttendance(): Promise<IAttendanceModel[]>;
    getEmployeesAttendanceByDate(name: string | null, department: string | null, startOfDay: number, endOfDay: number): Promise<IAttendanceModel[]>;
    countAttendanceWarning(employeeIds: Types.ObjectId[], endOfDay: number): Promise<ICountAttendanceWarning[]>;
    getAllAttendance(name: string | null, department: string | null): Promise<IAttendanceModel[]>
}