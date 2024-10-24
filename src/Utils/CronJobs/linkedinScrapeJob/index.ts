import cron from 'node-cron';
import 'dotenv/config';
import CandidateController from '../../../Controller/HR/Candidate/CandidateController';
import EmailService from '../../../Service/Message/EmailService';


const warningHTMLEmail = () => {
    const html = `
    <h1>Warning</h1>
    <p>Linkedin get candidate is not working</p>`
    return html;
}

const LinkedinScrapeJob = cron.schedule('0 0 * * *', async () => {
    try {
        const candidate = new CandidateController();
        await candidate.getCandidateFromLinkedin();
    } catch (error) {
        console.log("=======================>Enter inside error<===================")
        const emailService = new EmailService();
        for (const x of ["andrewgeeklab@gmail.com", "mostafageeklabs@gmail.com", "mohamedmamdouhgeeklab@gmail.com"])
            await emailService.sendEmail({
                to: x,
                subject: "Warning",
                html: warningHTMLEmail()
            });
        console.log("==========================>", { error })
    } finally {
        console.log("===================Cron job ended=======================")
    }
});

export default LinkedinScrapeJob;