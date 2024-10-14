import LinkedinScrapeJob from "./linkedinScrapeJob";
import RoomCronJob from "./RoomCronJob";
import ScrapCronJob from "./ScrapCronJob";

const startCronJobs = () => {
    ScrapCronJob.start();
    RoomCronJob.start();
    LinkedinScrapeJob.start();
}

export default startCronJobs;