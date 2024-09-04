import { app } from "./app";
import "dotenv/config";
import { DBConnection } from "./DbSetup/DbConfig";
import ScrapCronJob from "./Utils/CronJobs/ScrapCronJob";
import createIo from "./socketIo";

const port = process.env.PORT || 4000;
const server = app.listen(port, async () => {
  try {
    await DBConnection();
    console.log(`Server is Running And DB Connected http://localhost:${port}`);
    ScrapCronJob.start();
  } catch (error) {
    console.log(error);
  }
});

createIo(server);
export default app;