import Queue from 'bull';
import SocialMediaNewsLetterController from '../../../Controller/SocialMedia/NewsLetter/SendNewsLetterStep/SocialMediaNewsLetterController';
import "dotenv/config";

const redisOptions = {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASS,
};

console.log('Creating queue');

const emailQueue = new Queue('sendNewsLetter', { redis: redisOptions });
console.log('Queue created');

// Process jobs
emailQueue.process(async (job) => {
    console.log('start Processing job');
    const newsLetter = new SocialMediaNewsLetterController();
    await newsLetter.sendNewsLetter(job);
    console.log('Email sent');
});

// Add job to queue
const addJob = async (jobData: any, scheduleTime?: Date): Promise<void> => {
    const delay = scheduleTime ? scheduleTime.getTime() - Date.now() : 0;

    if (delay > 0) {
        console.log(`Scheduling job with delay ${delay}ms`);
        await emailQueue.add(jobData, { delay });
        console.log(`Job scheduled to be processed at ${scheduleTime}`);
    } else {
        await emailQueue.add(jobData);
        console.log('Job added to the queue');
    }
};

export { addJob };
