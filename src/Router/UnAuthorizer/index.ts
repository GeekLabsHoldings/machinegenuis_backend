import {Router} from 'express';
import candidateTaskRouter from './CandidateRouter';
import unAuthorizerNewsLetterRouter from './UnAuthNewsLetterRouter';

const unAuthorizerApis = Router();

unAuthorizerApis.use('/candidate',candidateTaskRouter);
unAuthorizerApis.use('/news-letter',unAuthorizerNewsLetterRouter);

export default unAuthorizerApis;