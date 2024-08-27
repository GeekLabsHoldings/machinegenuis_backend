import express, { Application } from 'express';
import cors from 'cors';
import AuthenticationRouter from './Router/Authentication';
import HR_Router from './Router/HR';
import AdminRouter from './Router/Admin';
import UserRouter from './Router/User';
import unAuthorizerApis from './Router/Candidate';
import CalendlyRouter from './Router/Calendly';


const app: Application = express();

import bodyParser from 'body-parser';

import path from "path"
import content_creation_router from './Router/ContentCreation/main';

app.use('/uploads', express.static(path.join(__dirname, "uploads")))
// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.json());
app.use(cors());


app.get('/', async (_, res) => {
    return res.json("Hello world!");
});
const delay = async (time: number): Promise<any> => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
app.get('/check-tld', async (_, res) => {
    await delay(2 * 60 * 1000);
    res.json({ result: "Hello" });
})


app.use('/authentication', AuthenticationRouter);
app.use('/hr', HR_Router);
app.use('/admin', AdminRouter);
app.use('/user', UserRouter);
app.use('/calendly', CalendlyRouter);
app.use('/un-authorized', unAuthorizerApis)
app.use('/content-creation', content_creation_router)
export { app };