import { app } from './app';
import 'dotenv/config';
import { DBConnection } from './DbSetup/DbConfig';
import ScrapCronJob from './Utils/CronJobs/ScrapCronJob';
import Ec2Service from './Service/AWS/EC2';


app.listen(process.env.PORT || 4000, async () => {
    try {
        await DBConnection();
        console.log('Server is Running And DB Connected http://localhost:4000');
        ScrapCronJob.start();
    } catch (error) {
        console.log(error);
    }
});


export default app;