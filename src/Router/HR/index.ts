import { Router } from 'express';
import GroupRouter from './GroupRouter';
import { check_HR_Authority } from '../../middleware/verifyToken';
import TemplateRouter from './TemplateRouter';
import HiringRouter from './HiringRouter';
import AttendanceRouter from './AttendanceRouter';
import CandidateRouter from './CandidateRouter';
import EmployeeRouter from './EmployeeRouter';
import EmployeePaperRouter from './EmployeePaperRouter';
import ComplaintRouter from './ComplaintRouter';
import EventRouter from './EventRouter';
import MessageRouter from './MessagesRouter';

const HR_Router = Router();

HR_Router.use(check_HR_Authority);

HR_Router.use('/group', GroupRouter);
HR_Router.use('/template', TemplateRouter);
HR_Router.use('/hiring', HiringRouter);
HR_Router.use('/attendance', AttendanceRouter)
HR_Router.use('/candidate', CandidateRouter);
HR_Router.use('/employee', EmployeeRouter);
HR_Router.use('/employee-paper', EmployeePaperRouter);
HR_Router.use('/complaint', ComplaintRouter);
HR_Router.use('/event', EventRouter);
HR_Router.use('/message', MessageRouter);

export default HR_Router;