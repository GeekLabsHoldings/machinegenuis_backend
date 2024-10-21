import { Router } from 'express';
import HiringRequestRouter from './RequestHiring';
import TaskRouter from './TaskRouter';
import AdminRoleRouter from './AdminRoleRouter';


const AdminRouter = Router();


AdminRouter.use('/hiring-request', HiringRequestRouter);
AdminRouter.use('/task', TaskRouter);
AdminRouter.use('/role', AdminRoleRouter);

export default AdminRouter;