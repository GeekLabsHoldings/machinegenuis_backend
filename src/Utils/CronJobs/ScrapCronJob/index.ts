import cron from 'node-cron';
import moment from '../../DateAndTime/index';
import 'dotenv/config';
import ScrapeController from '../../../Controller/ContentCreation/AutomaticScrape/ScrapeController';
import EmailService, { MailOptions } from '../../../Service/HR/Template/Message/EmailService';
import Ec2Service from '../../../Service/AWS/EC2';
const message = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EC2 Warning</title>
    <style>
        .warning {
            padding: 20px;
            background-color: #ffcc00;
            color: #333;
            text-align: center;
            font-family: Arial, sans-serif;
            border: 1px solid #ff9900;
            border-radius: 5px;
            margin: 50px auto;
            width: 50%;
        }
    </style>
</head>
<body>
    <div class="warning">
        ⚠️ Warning: Your EC2 instance is still running. Please ensure to stop it if not in use to avoid unnecessary charges.
    </div>
</body>
</html>`

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
        const ec2Close = await ec2Service.instanceActionStop();
        if (ec2Close && ec2Close.$metadata && ec2Close.$metadata.httpStatusCode) {
            if (ec2Close.$metadata.httpStatusCode >= 400) {
                const users = ["mostafageeklabs@gmail.com", "andrewgeeklab@gmail.com", "mohamedmamdouhgeeklab@gmail.com"]
                for (const user in users) {
                    const warningEmail: MailOptions = {
                        to: user,
                        subject: 'Warning When Stop Ec2',
                        html: message
                    }
                    const mail = new EmailService();
                    await mail.sendEmail(warningEmail);
                }
            }
        }

    } catch (error) {
        console.log("=======================>Enter inside error<===================")
        console.log("==========================>", { error })
    } finally {
        console.log("===================cron job ended=======================");
    }
});

export default ScrapCronJob;