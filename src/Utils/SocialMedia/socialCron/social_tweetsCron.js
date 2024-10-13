import cron from "node-cron";
import { tweets } from "../../../Controller/SocialMedia/get_tweets_mustApprove";
let isRunning = false;
export const twitterCron = cron.schedule("*/30 * * * *", async () => {
  if (isRunning) {
    console.log("Job is already running. Skipping this execution.");
    return;
  }
  isRunning = true;

  try {
    if (process.env.NODE_ENV !== 'PROD') {
      console.log("Cron job skipped in non-production environment.");
      return;
  }
    const response = await tweets();
    // if (Array.isArray(response) && response.length > 0) {
    //   const firstResponse = response[0];

    //   if (firstResponse.statusCode === 401 || firstResponse.statusCode === 429) {
    //     if (firstResponse.statusCode === 401) {
    //       await sendEmail({
    //         subject: "Authentication Error twitter api cron job",
    //         text: "Unauthorized access. Please check your credentials.",
    //       });
    //       job.stop();
    //     } else if (firstResponse.statusCode === 429) {
    //       await sendEmail({
    //         subject: "Too Many Requests Error twitter api cron job",
    //         text: "Too Many Requests. Stopping the job temporarily.",
    //       });
    //     }
    //   }
    // }
  } catch (error) {
    console.log(error);
  } finally {
    isRunning = false;
  }
});