import Queue from "bull";
import "dotenv/config";
import { getAccount } from "../../../Service/Operations/BrandCreation.service";
import { PlatformEnum } from "../../SocialMedia/Platform";
import moment from "../../../Utils/DateAndTime/index";
import { TwitterSocialMediaAddPost } from "../../../Service/SocialMedia/twitter.api";
export const addPostQueue = new Queue("PostTweets", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
});
export const twitterQueueAdd = async (
  content,
  mediaId,
  brandId,
  userId,
  startTime
) => {
  const delay = startTime - moment().valueOf();
  console.log("here1");
  if (delay > 0) {
    console.log(`Scheduling job with delay ${delay}ms`);
    await addPostQueue.add(
      {
        content,
        mediaId,
        brandId,
        userId,
      },
      { delay }
    );
  } else {
    await addPostQueue.add({
      content,
      mediaId,
      brandId,
      userId,
    });
  }
};
addPostQueue.process(async (job) => {
  const { content, mediaId, brandId, userId } = job.data;
  const twitterData = await getAccount(brandId, PlatformEnum.TWITTER);
  const response = await TwitterSocialMediaAddPost({
    content,
    appKey: twitterData.account.ConsumerKey,
    appSecret: twitterData.account.ConsumerSecret,
    accessToken: twitterData.account.AccessToken,
    accessSecret: twitterData.account.TokenSecret,
    mediaId,
  });
  if (response.success === 200) {
    const createPost = await createSocialAccountAddPost(
      PlatformEnum.TWITTER,
      brandId,
      content,
      userId,
      response.tweet.data.id
    );
  }
});
