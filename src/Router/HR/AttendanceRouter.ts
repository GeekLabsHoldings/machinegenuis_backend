import { Router, Request, Response } from 'express';
import systemError from '../../Utils/Error/SystemError';
import attendanceController from '../../Controller/HR/Attendance/AttendanceController';

const AttendanceRouter = Router();

AttendanceRouter.get('/today-attendance', async (req: Request, res: Response): Promise<Response> => {
    try {
        const name = (req.query.name) as string || null;
        const department = (req.query.department) as string || null;
        const day = parseInt(req.query.day as string) || null;
        const result = await attendanceController.getAttendance(name, department, day);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

AttendanceRouter.get('/warning-notification', async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await attendanceController.getEmployeeNotification();
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


export default AttendanceRouter;