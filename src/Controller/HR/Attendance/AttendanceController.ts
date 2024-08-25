import moment from "moment-timezone";
import IEmployeeModel from "../../../Model/Employee/IEmployeeModel";
import IAttendanceModel from "../../../Model/HR/Attendance/IAttendanceModel";
import attendanceService from "../../../Service/HR/Attendance/AttendanceService";
import IAttendanceController, { IAttendanceResponse } from "./IAttendanceController";
import { EndOfDay, StartOfDay } from "../../../Utils/DateAndTime";
import { Types } from "mongoose";
import { ICountAttendanceWarning } from "../../../Service/HR/Attendance/IAttendanceService";

class AttendanceController implements IAttendanceController {


    async getAttendance(name: string | null, department: string | null, date: number | null): Promise<IAttendanceResponse[]> {
        if (date)
            return await this.getTodayAttendance(name, department, date);
        else
            return await this.getAllAttendance(name, department);
    }

    async getTodayAttendance(name: string | null, department: string | null, date: number): Promise<IAttendanceResponse[]> {
        const dateMoment = moment(date);
        const startOfDay = StartOfDay(dateMoment);
        const endOfDay = EndOfDay(dateMoment);
        const todayAttendance = await attendanceService.getEmployeesAttendanceByDate(name, department, startOfDay, endOfDay);
        const employeeIds: Types.ObjectId[] = todayAttendance.map((item: IAttendanceModel) => {
            const employee = (item.employee) as IEmployeeModel;
            return new Types.ObjectId(employee._id)
        });
        const warningCount = await attendanceService.countAttendanceWarning(employeeIds, endOfDay);
        const employeeCount: Record<string, number> = {};
        warningCount.forEach((item: ICountAttendanceWarning) => {
            employeeCount[item.employee] = item.warning;
        })
        const result = todayAttendance.map((item: IAttendanceModel) => {
            const employee = (item.employee) as IEmployeeModel;
            return {
                firstName: employee.firstName,
                lastName: employee.lastName,
                department: employee.department,
                checkedIn: item.checkedIn,
                checkedOut: item.checkedOut,
                warningCount: employeeCount[(employee._id) as string] || 0
            }
        })
        return result;
    }


    async getAllAttendance(name: string | null, department: string | null): Promise<any[]> {
        const attendanceData = await attendanceService.getAllAttendance(name, department);
        const result: IAttendanceResponse[] = [];
        const data: Record<string, number> = {};
        for (let i = attendanceData.length - 1; i >= 0; i--) {
            const employee = attendanceData[i].employee as IEmployeeModel;
            const employee_id = (employee._id).toString();
            if (!data[employee_id]) {
                data[employee_id] = 0;
            }
            const warning = attendanceData[i].warning;
            const excuse = attendanceData[i].excuse;

            const count = (warning && (!excuse)) ? 1 : 0;
            data[employee_id] = data[employee_id] + count;
            result.push({
                firstName: employee.firstName,
                lastName: employee.lastName,
                department: employee.department,
                checkedIn: attendanceData[i].checkedIn,
                checkedOut: attendanceData[i].checkedOut,
                warningCount: data[employee_id]
            })
        }
        result.reverse();
        return result;
    }
    async getEmployeeNotification(): Promise<Record<number, IAttendanceModel[]>> {
        const countAttendance = await attendanceService.getAllWarningAttendance();
        const result: Record<number, IAttendanceModel[]> = {};
        const employeeWarningNotification: Record<string, IAttendanceModel[]> = {};
        countAttendance.forEach((item: IAttendanceModel) => {
            const employee = item.employee as IEmployeeModel;
            const employeeId = employee._id as string;
            if (item.warning && !(item.excuse)) {
                if (!employeeWarningNotification[employeeId]) {
                    employeeWarningNotification[employeeId] = [];
                }
                employeeWarningNotification[employeeId].push(item);
            }
        });
        for (const employeeId in employeeWarningNotification) {
            if (employeeWarningNotification.hasOwnProperty(employeeId)) {
                const employeeLateAttendance = employeeWarningNotification[employeeId];
                const count = employeeLateAttendance.length;
                const index = count < 5 ? count : 5;
                if (!result[index]) {
                    result[count] = [];
                }

                result[index].push(employeeLateAttendance[employeeLateAttendance.length - 1]);
            }
        }

        return result;
    }

}

const attendanceController = new AttendanceController();
export default attendanceController;