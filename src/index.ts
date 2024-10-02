import { app } from "./app";
import "dotenv/config";
import { DBConnection } from "./DbSetup/DbConfig";
import createIo from "./socketIo";
import startCronJobs from "./Utils/CronJobs/startCronJobs";
const port = process.env.PORT || 4000;
const server = app.listen(port, async () => {
  try {
    await DBConnection();
    console.log(`Server is Running And DB Connected http://localhost:${port}`);
    process.env.NODE_ENV === "PROD" ? startCronJobs() : null;
  } catch (error) {
    console.log(error);
  }
});

createIo(server);
export default app;
