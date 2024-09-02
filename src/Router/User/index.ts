import { Router } from 'express';
import CreateComplaintRouter from './CreateComplaintRouter';
import TaskRouter from './TaskRouter';


const UserRouter = Router();


UserRouter.use('/complaint', CreateComplaintRouter);
UserRouter.use('/task', TaskRouter);

export default UserRouter;