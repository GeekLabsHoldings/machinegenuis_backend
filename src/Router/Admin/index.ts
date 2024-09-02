import { Router } from 'express';
import HiringRequestRouter from './RequestHiring';
import TaskRouter from './TaskRouter';


const AdminRouter = Router();


AdminRouter.use('/hiring-request', HiringRequestRouter);
AdminRouter.use('/task',TaskRouter);

export default AdminRouter;