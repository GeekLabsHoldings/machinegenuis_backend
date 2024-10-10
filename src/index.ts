import { app } from "./app";
import "dotenv/config";
import { DBConnection } from "./DbSetup/DbConfig";
import createIo from "./socketIo";
import startCronJobs from "./Utils/CronJobs/startCronJobs";
const port = process.env.PORT || 4000;
import "./Utils/CronJobs/TweetsQueue/queue";
import { startAgenda } from "./Model/Operations/BroadCast/BroadCastAgenda";
import { tweets } from "./Controller/SocialMedia/get_tweets_mustApprove";
const server = app.listen(port, async () => {
  try {
    
    await DBConnection();
    await tweets();
  
    startAgenda();
    console.log(`Server is Running And DB Connected http://localhost:${port}`);
    startCronJobs();
  } catch (error) {
    console.log(error);
  }
});

createIo(server);
export default app;
