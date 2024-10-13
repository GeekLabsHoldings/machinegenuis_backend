import cron from "node-cron";
import { tweets } from "../../../Controller/SocialMedia/get_tweets_mustApprove";
let isRunning = false;
export const twitterCron = cron.schedule("*/30 * * * *", async () => {
  if (process.env.REDIS_PORT !== "16388") {
    console.log("Cron job skipped in non-production environment.");
    return;
}
  if (isRunning) {
    console.log("Job is already running. Skipping this execution.");
    return;
  }
  isRunning = true;

  try {
    const response = await tweets();
  } catch (error) {
    console.log(error);
  } finally {
    isRunning = false;
  }
});