import express, { Application } from "express";
import cors from "cors";
import AuthenticationRouter from "./Router/Authentication";
import HR_Router from "./Router/HR";
import AdminRouter from "./Router/Admin";
import UserRouter from "./Router/User";
import unAuthorizerApis from "./Router/UnAuthorizer";
import CalendlyRouter from "./Router/Calendly";
const app: Application = express();
import bodyParser from "body-parser";
import path from "path";
import content_creation_router from "./Router/ContentCreation/main";
import video_editing_router from "./Router/VideoEditing/main";
import { checkAuthority } from "./middleware/verifyToken";
import RouterEnum from "./Utils/Routes";
import socialMediaRouter from "./Router/SocialMedia";
import AdministrativeRouter from "./Router/Administrative";
import AccountingRouter from "./Router/Accounting";
import OperationRouter from "./Router/Operations";
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.get("/", async (_, res) => {
  return res.json("Hello world!");
});

async function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

app.get("/test-delay", async (req, res) => {
  await delay(45 * 60 * 1000);
  return res.json("Done it work");
});


app.use(`/${RouterEnum.authentication}`, AuthenticationRouter);
app.use(`/${RouterEnum.unAuthorizer}`, unAuthorizerApis);
app.use(`/${RouterEnum.calendly}`, CalendlyRouter);
app.use(`/${RouterEnum.VideoEditing}`, video_editing_router);
app.use(checkAuthority);

app.use(`/${RouterEnum.ContentCreation}`, content_creation_router);
app.use(`/${RouterEnum.hr}`, HR_Router);
app.use(`/${RouterEnum.admin}`, AdminRouter);
app.use(`/${RouterEnum.user}`, UserRouter);
app.use(`/${RouterEnum.Administrative}`, AdministrativeRouter);
app.use(`/${RouterEnum.Accounting}`, AccountingRouter);

app.use(`/${RouterEnum.socialMedia}`, socialMediaRouter);
app.use(`/${RouterEnum.CEO}`, OperationRouter)

export { app };
