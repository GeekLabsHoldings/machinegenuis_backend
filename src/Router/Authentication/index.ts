import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import AuthenticationController from "../../Controller/Authentication/AuthenticationController";
import systemError from "../../Utils/Error/SystemError";
import SuccessMessage from "../../Utils/SuccessMessages";
import { checkAuthority } from "../../middleware/verifyToken";

const AuthenticationRouter = Router();

AuthenticationRouter.post('/', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { email, password } = req.body;
        const authenticationController = new AuthenticationController(session);
        const token = await authenticationController.login(email, password);
        await session.commitTransaction();
        return res.json({ message: SuccessMessage.LOGGED_IN_SUCCESSFULLY, logged_in_token: token });
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);

    } finally {
        session.endSession();
    }
})


AuthenticationRouter.post('/logout', checkAuthority,async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { _id } = req.body.currentUser;
        const authenticationController = new AuthenticationController(session);
        await authenticationController.logout(_id);
        await session.commitTransaction();
        return res.json(SuccessMessage.DONE);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
})

AuthenticationRouter.get('/check-auth', checkAuthority,async (req: Request, res: Response): Promise<Response> => {
    return res.json({ result: req.body.currentUser });
});

export default AuthenticationRouter;