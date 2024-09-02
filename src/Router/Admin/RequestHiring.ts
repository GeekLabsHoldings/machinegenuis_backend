import { Router, Request, Response } from "express";
import systemError from "../../Utils/Error/SystemError";
import IHiringModel from "../../Model/HR/Hiring/IHiringModel";
import hiringController from "../../Controller/HR/Hiring/HiringController";
import { HiringStatusLevelEnum } from "../../Utils/Hiring";
import { HiringStepsEnum } from "../../Utils/GroupsAndTemplates";

const HiringRequestRouter = Router();


HiringRequestRouter.post('/', async (req: Request, res: Response): Promise<Response> => {
    try {
        const RequestHiring: IHiringModel = {
            title: req.body.title,
            level: req.body.level,
            createdAt: new Date().getTime(),
            createdBy: req.body.currentUser._id,
            department: req.body.department || req.body.currentUser.department[0],
            currentStep: HiringStepsEnum.REQUEST_HIRING,
            hiringStatus: HiringStatusLevelEnum.START_HIRING,
            role: req.body.role,
            linkedinAccount: null
        };
        const result = await hiringController.createHiring(RequestHiring);
        return res.status(201).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


HiringRequestRouter.delete('/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const result = await hiringController.deleteHiringRequest(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

export default HiringRequestRouter;