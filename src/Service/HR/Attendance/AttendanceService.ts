import { ClientSession, PipelineStage, Types, UpdateWriteOpResult } from "mongoose";
import IAttendanceService, { ICountAttendanceWarning } from "./IAttendanceService";
import attendanceModel from "../../../Model/HR/Attendance/AttendanceModel";
import IAttendanceModel from "../../../Model/HR/Attendance/IAttendanceModel";

class AttendanceService implements IAttendanceService {

    async checkAttend(employeeId: string, startOfDay: number, endOfDay: number, session: ClientSession): Promise<boolean> {
        const attendanceExists = await attendanceModel.exists({
            employee: employeeId,
            checkedIn: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        }).session(session);
        return attendanceExists !== null;
    }

    async checkedIn(employeeId: string, checkedIn: number, warning: boolean, session: ClientSession): Promise<boolean> {
        try {
            await attendanceModel.create([{ employee: employeeId, checkedIn, warning }], { session });
            return true;
        } catch (error) {
            return false;
        }
    }

    async checkedOut(employeeId: string, startOfDay: number, checkedOut: number, session: ClientSession): Promise<boolean> {
        const leave: UpdateWriteOpResult = await attendanceModel.updateOne({ employee: employeeId, checkedIn: { $gte: startOfDay } }, { $set: { checkedOut } }).session(session);
        return leave.modifiedCount ? true : false
    }

    async getAllWarningAttendance(): Promise<IAttendanceModel[]> {
        return await attendanceModel.find({ warning: true, excuse: false }).populate({ path: 'employee', select: { firstName: 1, lastName: 1, department: 1, role: 1 } });
    }

    async getEmployeesAttendanceByDate(name: string | null, department: string | null, startOfDay: number, endOfDay: number): Promise<IAttendanceModel[]> {
        const pipeline = [
            {
                $match: {
                    checkedIn: {
                        $gte: startOfDay,
                        $lt: endOfDay
                    }
                }
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employee',
                    foreignField: '_id',
                    as: 'employeeData'
                }
            },
            {
                $unwind: {
                    path: '$employeeData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    ...(name ? {
                        $or: [
                            { 'employeeData.firstName': { $regex: name, $options: 'i' } },
                            { 'employeeData.lastName': { $regex: name, $options: 'i' } }
                        ]
                    } : {}),
                    ...(department ? {
                        'employeeData.department': {
                            $elemMatch: { $eq: department }
                        }
                    } : {})
                }
            },
            {
                $project: {
                    checkedIn: 1,
                    checkedOut: 1,
                    excuse: 1,
                    warning: 1,
                    employee: {
                        _id: '$employeeData._id',
                        firstName: '$employeeData.firstName',
                        lastName: '$employeeData.lastName',
                        department: '$employeeData.department'
                    }
                }
            }
        ];

        const result = await attendanceModel.aggregate(pipeline).exec();

        return result;
    }

    async countAttendanceWarning(employeeIds: Types.ObjectId[], endOfDay: number): Promise<ICountAttendanceWarning[]> {
        const result = await attendanceModel.aggregate([
            {
                $match: {
                    employee: { $in: employeeIds },
                    checkedIn: { $lte: endOfDay },
                    warning: true,
                    excuse: false
                }
            },
            {
                $group: {
                    _id: '$employee',
                    warning: { $sum: { $cond: [{ $eq: ['$excuse', false] }, 1, 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    employee: '$_id',
                    warning: 1
                }
            }
        ]);
        return result;
    }

    async getAllAttendance(name: string | null, department: string | null): Promise<IAttendanceModel[]> {
        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employee',
                    foreignField: '_id',
                    as: 'employeeData'
                }
            },
            {
                $unwind: {
                    path: '$employeeData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    ...(name ? {
                        $or: [
                            { 'employeeData.firstName': { $regex: name, $options: 'i' } },
                            { 'employeeData.lastName': { $regex: name, $options: 'i' } }
                        ]
                    } : {}),
                    ...(department ? {
                        'employeeData.department': department
                    } : {})
                }
            },
            {
                $sort: { checkedIn: -1 }
            },
            {
                $project: {
                    checkedIn: 1,
                    checkedOut: 1,
                    excuse: 1,
                    warning: 1,
                    employee: {
                        _id: '$employeeData._id',
                        firstName: '$employeeData.firstName',
                        lastName: '$employeeData.lastName',
                        department: '$employeeData.department'
                    }
                }
            }
        ];

        const result = await attendanceModel.aggregate(pipeline).exec();

        return result;
    }

}

const attendanceService = new AttendanceService();
export default attendanceService;