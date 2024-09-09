import { app } from "./app";
import "dotenv/config";
import { DBConnection } from "./DbSetup/DbConfig";
import ScrapCronJob from "./Utils/CronJobs/ScrapCronJob";
import createIo from "./socketIo";
import { ConvertAudio } from "./Controller/VideoEditing/ConvertAudio_tts";

const port = process.env.PORT || 4000;
const server = app.listen(port, async () => {
  try {
    await DBConnection();
    await ConvertAudio("Today is a wonderful day to build something people love!")
    console.log(`Server is Running And DB Connected http://localhost:${port}`);
    ScrapCronJob.start();
  } catch (error) {
    console.log(error);
  }
});



createIo(server);
export default app;