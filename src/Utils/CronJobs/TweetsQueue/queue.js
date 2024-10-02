import Queue from "bull";
import "dotenv/config";
import eventEmitter from "../../EventEmitter/eventEmitter";
const postApprovalQueue = new Queue("postApproval", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
});
console.log("Queue created");
postApprovalQueue.process(async (job) => {
  const eventData = {
    tweetId: job.data.tweetId,
    content: job.data.content,
    brand: job.data.brand,
    reply: job.data.reply,
    campaignType: job.data.campaignType,
    userName: job.data.userId,
  };
  await eventEmitter.emit("TwitterNewTweets", eventData);
  console.log("Event emitted");
});

