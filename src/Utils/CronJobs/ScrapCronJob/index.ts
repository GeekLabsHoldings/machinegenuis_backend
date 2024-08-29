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
    const day = moment().day();
    if (day === 5 || day === 6) {
        console.log("========Today is a vacation===================");
        return;
    }
    const hour = moment().hour();
    if (hour <= 9 || hour >= 17) {
        console.log("================After work hour================");
        return;
    }
    const instanceId = process.env.INSTANCE_ID as string
    const ec2Service = new Ec2Service(instanceId);
    const scrapeController = new ScrapeController()
    try {
        console.log("===================cron job started=======================");
        await ec2Service.instanceActionStart();
        await delay(40000);
        console.log("After wait 40s")
        await scrapeController.generateScraping()
    } catch (error) {
        console.log("=======================>Enter inside error<===================")
        console.log("==========================>", { error })
    } finally {
        await ec2Service.instanceActionStop();
        console.log("===================instance job ended=======================");
        await scrapeController.generateTitleAndArticles();
        console.log("===================Cron job ended=======================")

    }
});

export default ScrapCronJob;