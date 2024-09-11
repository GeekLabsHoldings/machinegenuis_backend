import { Router, Request, Response } from "express";
import systemError from "../../Utils/Error/SystemError";
import CandidateController from "../../Controller/HR/Candidate/CandidateController";
import mongoose, { Types } from "mongoose";
import ICandidateQuestionsModel from "../../Model/HR/Candidate/ICandidateQuestionsModel";
import { StatusEnum } from "../../Utils/Hiring";
import EmployeeController from "../../Controller/HR/Employee/EmployeeController";
import IPayrollModel from "../../Model/Accounting/Payroll/IPayrollModel";
import moment from "../../Utils/DateAndTime"

const CandidateRouter = Router();


CandidateRouter.get('/all-candidate', async (req: Request, res: Response): Promise<Response> => {
    try {
        const role = (req.query.role) as string || null;
        const limit = parseInt(req.query.limit as string) || 10
        const skip = parseInt(req.query.skip as string) || 0
        const candidateController = new CandidateController();
        const result = await candidateController.getAllCandidate(role, limit, skip)
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

CandidateRouter.get('/hiring/:_id/:_hiringStep', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id, _hiringStep } = req.params;
        const limit = parseInt(req.query.limit as string) || 10
        const skip = parseInt(req.query.skip as string) || 0
        const candidateController = new CandidateController();
        const result = await candidateController.getAllCandidateByHiring(_id, _hiringStep, limit, skip)
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

CandidateRouter.put('/next-hiring-step/:_id', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { _id } = req.params;
        const candidateController = new CandidateController();
        const result = await candidateController.changeCurrentStepStatus(_id, true, session);
        await session.commitTransaction();
        return res.json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        await session.endSession();
    }
})


CandidateRouter.put('/reject/:_id', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { _id } = req.params;
        const candidateController = new CandidateController();
        const result = await candidateController.changeCurrentStepStatus(_id, false, session);
        await session.commitTransaction();
        return res.json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        await session.endSession();
    }
})


CandidateRouter.put('/add-question-answer/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const candidateQuestion: ICandidateQuestionsModel = {
            questions: req.body.questions,
            candidate: new Types.ObjectId(_id),
            taskApprove: StatusEnum.PENDING
        };
        const candidateController = new CandidateController();
        const result = await candidateController.addCandidateQuestion(candidateQuestion);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})



CandidateRouter.get('/get-candidate-question-answer/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const candidateController = new CandidateController();
        const result = await candidateController.getCandidateQuestion(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


CandidateRouter.get('/all-candidate-with-Answers/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const candidateController = new CandidateController();
        const result = await candidateController.getAllCandidateQuestionsAndTask(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

CandidateRouter.put('/convert-to-employee/:_id', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { _id } = req.params;
        const employer_id = req.body.currentUser;
        const { paper, birthday, email, theme, password } = req.body;
        const payrollData: IPayrollModel = {
            socialInsurance: req.body.socialInsurance,
            medicalInsurance: req.body.medicalInsurance,
            netSalary: req.body.netSalary,
            createdAt: moment().valueOf()
        }
        const employeeController = new EmployeeController();

        const result = await employeeController.convertCandidateToEmployee(employer_id, _id, paper, email, password, birthday, theme, payrollData, session);
        await session.commitTransaction()
        return res.json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession()
    }
})




export default CandidateRouter;