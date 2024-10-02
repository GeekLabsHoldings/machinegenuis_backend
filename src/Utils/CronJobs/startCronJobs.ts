import RoomCronJob from "./RoomCronJob";
import ScrapCronJob from "./ScrapCronJob";

const startCronJobs = () => {
    console.log("--------------------");
    ScrapCronJob.start();
    RoomCronJob.start();
}

export default startCronJobs;