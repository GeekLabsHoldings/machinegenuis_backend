import { Router, Request, Response } from "express";
import moment from "moment";
import systemError from "../../Utils/Error/SystemError";
import { ICreateTaskBody } from "../../Controller/Task/ITaskController";
import TaskController from "../../Controller/Task/TaskController";
import CandidateController from "../../Controller/HR/Candidate/CandidateController";
import { StatusEnum } from "../../Utils/Hiring";
import mongoose from "mongoose";
const TaskRouter = Router()

TaskRouter.post('/create', async (req: Request, res: Response): Promise<Response> => {
    try {
        const event: ICreateTaskBody = {
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            startNumber: moment(req.body.start, 'YYYY-MM-DD').startOf('day').valueOf(),
            endNumber: moment(req.body.end, 'YYYY-MM-DD').endOf('day').valueOf(),
            createdBy: req.body.currentUser._id,
            backgroundColor: req.body.backgroundColor,
            assignedTo: req.body.assignedTo
        }
        const taskController = new TaskController();
        const result = await taskController.createTask(event);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

TaskRouter.put('/edit-task/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const event: ICreateTaskBody = {
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            startNumber: moment(req.body.start, 'YYYY-MM-DD').startOf('day').valueOf(),
            endNumber: moment(req.body.end, 'YYYY-MM-DD').endOf('day').valueOf(),
            createdBy: req.body.currentUser._id,
            backgroundColor: req.body.backgroundColor,
            assignedTo: req.body.assignedTo
        }
        const taskController = new TaskController();
        const result = await taskController.editTask(_id, event);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

TaskRouter.get('/department-task', async (req: Request, res: Response): Promise<Response> => {
    try {
        const department = req.body.currentUser.department;
        const taskController = new TaskController();
        const result = await taskController.getDepartmentTask(department);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

TaskRouter.delete('/delete/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const taskController = new TaskController();
        const result = await taskController.deleteTask(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


TaskRouter.get('/all-candidate-with-answers/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const candidateController = new CandidateController();
        const result = await candidateController.getAllCandidateQuestionsAndTask(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

TaskRouter.put('/approve-candidate-task/:_id', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const { _id } = req.params;
        const candidateController = new CandidateController();
        const result = await candidateController.changeCandidateTaskStatus(_id, StatusEnum.APPROVED, session);
        await session.commitTransaction();
        return res.json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
})

TaskRouter.put('/reject-candidate-task/:_id', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const { _id } = req.params;
        const candidateController = new CandidateController();
        const result = await candidateController.changeCandidateTaskStatus(_id, StatusEnum.REJECTED, session);
        await session.commitTransaction();
        return res.json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
})



export default TaskRouter;