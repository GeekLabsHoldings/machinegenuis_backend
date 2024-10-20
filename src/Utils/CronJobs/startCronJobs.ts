import LinkedinScrapeJob from "./linkedinScrapeJob";
import { twitterCron } from "../SocialMedia/socialCron/social_tweetsCron";
import RoomCronJob from "./RoomCronJob";
import ScrapCronJob from "./ScrapCronJob";
import scheduleR from "./SocialCronJob/updateSubs/redditUpdateSubs";
import scheduleT from "./SocialCronJob/updateSubs/telegramUpdateSubs";
import scheduleY from "./SocialCronJob/updateSubs/youtubeUpdateSubs";

const startCronJobs = () => {
    ScrapCronJob.start();
    RoomCronJob.start();
    LinkedinScrapeJob.start();
    twitterCron.start();
    scheduleR.start();
    scheduleT.start();
    scheduleY.start();
}

export default startCronJobs;