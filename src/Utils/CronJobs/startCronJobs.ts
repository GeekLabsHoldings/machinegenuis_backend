import RoomCronJob from "./RoomCronJob";
import ScrapCronJob from "./ScrapCronJob";

const startCronJobs = () => {
    ScrapCronJob.start();
    RoomCronJob.start();
}

export default startCronJobs;