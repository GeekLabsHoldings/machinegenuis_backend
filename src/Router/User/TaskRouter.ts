import { Router, Request, Response } from "express";
import systemError from "../../Utils/Error/SystemError";
import TaskController from "../../Controller/Task/TaskController";
import moment from "moment-timezone";
const TaskRouter = Router()

TaskRouter.put('/update-task/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const employee = req.body.currentUser._id;
        const article: { article: string; articleImg: string; articleTitle: string; } = {
            article: req.body.article,
            articleImg: req.body.articleImg,
            articleTitle: req.body.article
        }
        const taskController = new TaskController();
        const result = await taskController.updateTask(_id, article, employee);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


TaskRouter.get('/get-one/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const taskController = new TaskController();
        const result = await taskController.getOneTask(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


TaskRouter.get('/all', async (req: Request, res: Response): Promise<Response> => {
    try {
        const _id = req.body.currentUser._id;
        const taskController = new TaskController();
        const result = await taskController.getMyTask(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})
export default TaskRouter;