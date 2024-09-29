import Queue from "bull";
import * as RedditServices from "../../../Service/SocialMedia/reddit.Service";


function delay_(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

const redisOptions = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASS,
};


// Create a queue with a name (e.g., 'my-queue')
const redditQueue = new Queue("reddit-social-queue1",  { redis: redisOptions });

redditQueue.on('error', (err) => {
    console.error('Queue error:', err);
  });

redditQueue.process((job) => {
  console.log("Processing job: \t\n\n\n\n");
  // use job.data to do your function
  console.log(job.data.groups)
  job.data.groups.forEach(async (group)=>{
      
    const acount = await RedditServices.getAccount(group.brand);
    console.log("acount  /n", acount)
    const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password);
    const m = await RedditServices.CreateRedditPost(r, job.data.title, job.data.text, job.data.url,  group.group_id)
    console.log("reddit post \n", m)
    if (m && m.name)
      await RedditServices.AddRedditPostDB(m.name, group.group_name, group.group_id, Date.now(), group.brand)

    delay_(job.data.delay)
  })
});

const redditQueueAddJob =  (data, delay) => {
  console.log("Job added:", data);
    redditQueue.add(data,{delay:delay});
  console.log("Job added success");
};

export default redditQueueAddJob;
