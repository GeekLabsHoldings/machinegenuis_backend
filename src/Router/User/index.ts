import { Router } from 'express';
import { checkEmployeeAuthority } from '../../middleware/verifyToken';
import CreateComplaintRouter from './CreateComplaintRouter';
import TaskRouter from './TaskRouter';


const UserRouter = Router();

UserRouter.use(checkEmployeeAuthority);

UserRouter.use('/complaint', CreateComplaintRouter);
UserRouter.use('/task', TaskRouter);

export default UserRouter;