import {Router} from 'express';
import candidateTaskRouter from './TaskRouter';

const unAuthorizerApis = Router();

unAuthorizerApis.use('/send-task',candidateTaskRouter);

export default unAuthorizerApis;