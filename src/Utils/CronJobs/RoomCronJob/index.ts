import cron from 'node-cron';
import roomService from '../../../Service/Administrative/Rooms/RoomService';

const RoomCronJob = cron.schedule('0 0 * * 2', async () => {

    try {
        console.log("===================cron job started=======================");
        await roomService.resetRoomsStatus();
    } catch (error) {
        console.log("==========================>", { error })
    }

});

export default RoomCronJob;