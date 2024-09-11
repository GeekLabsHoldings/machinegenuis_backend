import cron from 'node-cron';
import moment from '../../DateAndTime/index';
import 'dotenv/config';
import ScrapeController from '../../../Controller/ContentCreation/AutomaticScrape/ScrapeController';
import Ec2Service from '../../../Service/AWS/EC2';
import EmailService from '../../../Service/HR/Template/Message/EmailService';

const delay = async (time: number): Promise<any> => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}


const warningHTMLEmail = () => {
    const html = `
    <h1>Warning</h1>
    <p>Scraping is not working</p>`
    return html;
}

const ScrapCronJob = cron.schedule('0 * * * *', async () => {
    const hour = moment().hour();
    if (hour <= 6 || hour >= 19) {
        console.log("================After work hour================");
        return;
    }
    const instanceId = process.env.INSTANCE_ID as string
    const ec2Service = new Ec2Service(instanceId);
    const scrapeController = new ScrapeController()
    const emailService = new EmailService();
    try {
        console.log("===================cron job started=======================");
        await ec2Service.instanceActionStart();
        await delay(120000);
        console.log("After wait 120 seconds")
        await scrapeController.generateScraping()
    } catch (error) {
        console.log("=======================>Enter inside error<===================")
        for (const x of ["andrewgeeklab@gmail.com", "mostafageeklabs@gmail.com", "mohamedmamdouhgeeklab@gmail.com"])
            await emailService.sendEmail({
                to: x,
                subject: "Warning",
                html: warningHTMLEmail()
            });
        console.log("==========================>", { error })
    } finally {
        await ec2Service.instanceActionStop();
        console.log("===================instance job ended=======================");
        await scrapeController.generateTitleAndArticles();
        console.log("===================Cron job ended=======================")

    }
});

export default ScrapCronJob;