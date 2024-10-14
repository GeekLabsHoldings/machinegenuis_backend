import LinkedinScrapeJob from "./linkedinScrapeJob";
import { twitterCron } from "../SocialMedia/socialCron/social_tweetsCron";
import RoomCronJob from "./RoomCronJob";
import ScrapCronJob from "./ScrapCronJob";

const startCronJobs = () => {
    ScrapCronJob.start();
    RoomCronJob.start();
    LinkedinScrapeJob.start();
    twitterCron.start();
}

export default startCronJobs;