import { app } from "./app";
import "dotenv/config";
import { DBConnection } from "./DbSetup/DbConfig";
import createIo from "./socketIo";
import startCronJobs from "./Utils/CronJobs/startCronJobs";
import "./Utils/CronJobs/TweetsQueue/queue";
const port = process.env.PORT || 4000;
const server = app.listen(port, async () => {
  try {
    await DBConnection();
    console.log(`Server is Running And DB Connected http://localhost:${port}`);
    startCronJobs();
  } catch (error) {
    console.log(error);
  }
});

createIo(server);
export default app;
