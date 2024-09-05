import { Router } from 'express';
import CreateComplaintRouter from './CreateComplaintRouter';
import TaskRouter from './TaskRouter';
import conversionRouter from './conversion.router';


const UserRouter = Router();


UserRouter.use('/complaint', CreateComplaintRouter);
UserRouter.use('/task', TaskRouter);
UserRouter.use("/conversation",conversionRouter)
export default UserRouter;