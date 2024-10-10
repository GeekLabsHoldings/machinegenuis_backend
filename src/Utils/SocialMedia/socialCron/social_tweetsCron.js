import cron from "node-cron";
import { tweets } from "../../../Controller/SocialMedia/get_tweets_mustApprove";
export const twitterCron = cron.schedule("*/30 * * * *", async () => {
  try {
    const response = await tweets();
  } catch (error) {
    console.log(error);
  } finally {
    isRunning = false;
  }
});
