import { app } from "./app";
import "dotenv/config";
import { DBConnection } from "./DbSetup/DbConfig";
import createIo from "./socketIo";
import startCronJobs from "./Utils/CronJobs/startCronJobs";
import "./Utils/CronJobs/TweetsQueue/queue";
import { startAgenda } from "./Model/Operations/BroadCast/BroadCastAgenda";
const port = process.env.PORT || 4000;


const server = app.listen(port, async () => {
  try {
    await DBConnection();
    startAgenda();
    console.log(`Server is Running And DB Connected http://localhost:${port}`);
    if (process.env.NODE_ENV === "PROD") startCronJobs();

  } catch (error) {
    console.log(error);
  }
});

createIo(server);
export default app;
