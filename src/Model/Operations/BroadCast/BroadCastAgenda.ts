import Agenda from "agenda";
import BroadCastMessageModel from "./BroadCastMessage.model";

const agenda = new Agenda({ db: { address: process.env.DB_CONNECTION ?? "" } });
agenda.define("delete-message", async (job: any) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    await BroadCastMessageModel.deleteMany({ createdAt: { $lt: oneWeekAgo } });
    console.log("Deleted messages older than one week.");
  } catch (error) {
    console.log(error);
  }
});
const startAgenda = async () => {
  await agenda.start();
  await agenda.every("7 days", "delete-message");
  console.log("Agenda started and scheduled delete-message job.");
};
export { startAgenda };
