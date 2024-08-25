import IAttendanceModel from "../../../Model/HR/Attendance/IAttendanceModel";
export interface IAttendanceResponse {
    firstName: string,
    lastName: string,
    department: string[],
    checkedIn: number,
    checkedOut: number,
    warningCount: number
}
export default interface IAttendanceController {
    getAttendance(name: string | null, department: string | null, date: number | null): Promise<IAttendanceResponse[]>;
    getTodayAttendance(name: string | null, department: string | null, date: number): Promise<IAttendanceResponse[]>;
    getAllAttendance(name: string | null, department: string | null): Promise<IAttendanceResponse[]>;
    getEmployeeNotification(): Promise<Record<number, IAttendanceModel[]>>;
}