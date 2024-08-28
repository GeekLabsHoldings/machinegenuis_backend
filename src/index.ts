import { app } from './app';
import 'dotenv/config';
import { DBConnection } from './DbSetup/DbConfig';
import ScrapCronJob from './Utils/CronJobs/ScrapCronJob';

const port = process.env.PORT || 4000
app.listen(port, async () => {
    try {
        await DBConnection();
        console.log(`Server is Running And DB Connected http://localhost:${port}`);
        ScrapCronJob.start();
    } catch (error) {
        console.log(error);
    }
});


export default app;