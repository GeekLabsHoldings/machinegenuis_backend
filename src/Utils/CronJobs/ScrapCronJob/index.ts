import cron from 'node-cron';
import moment from '../../DateAndTime/index';
import 'dotenv/config';
import ScrapeController from '../../../Controller/ContentCreation/AutomaticScrape/ScrapeController';
import Ec2Service from '../../../Service/AWS/EC2';

const delay = async (time: number): Promise<any> => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
const ScrapCronJob = cron.schedule('0 * * * *', async () => {
    try {
        console.log("===================cron job started=======================");
        const day = moment().day();
        if (day === 5 || day === 6)
            return;
        const hour = moment().hour();
        if (hour <= 7 || hour >= 19)
            return;
        const instanceId = process.env.INSTANCE_ID as string
        const ec2Service = new Ec2Service(instanceId);
        await ec2Service.instanceActionStart();
        await delay(40000);
        console.log("After wait 20s")
        const scrapeController = new ScrapeController()
        await scrapeController.generateScraping()
        await ec2Service.instanceActionStop();
    } catch (error) {
        console.log("=======================>Enter inside error<===================")
        console.log("==========================>", { error })
    } finally {
        console.log("===================cron job ended=======================");
    }
});

export default ScrapCronJob;