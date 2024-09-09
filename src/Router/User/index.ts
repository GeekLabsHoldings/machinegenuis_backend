import { Router } from 'express';
import CreateComplaintRouter from './CreateComplaintRouter';
import TaskRouter from './TaskRouter';
import conversionRouter from './conversion.router';
import EmployeeRouter from '../HR/EmployeeRouter';


const UserRouter = Router();


UserRouter.use('/complaint', CreateComplaintRouter);
UserRouter.use('/task', TaskRouter);
UserRouter.use("/conversation",conversionRouter);
UserRouter.use("/employee",EmployeeRouter)

export default UserRouter;