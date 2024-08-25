import { Router } from 'express';
import { checkAdminAuthority } from '../../middleware/verifyToken';
import HiringRequestRouter from './RequestHiring';
import TaskRouter from './TaskRouter';


const AdminRouter = Router();

AdminRouter.use(checkAdminAuthority);

AdminRouter.use('/hiring-request', HiringRequestRouter);
AdminRouter.use('/task',TaskRouter);

export default AdminRouter;