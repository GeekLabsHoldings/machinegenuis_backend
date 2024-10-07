import Queue from "bull";
import "dotenv/config";
import { getAccount } from "../../../Service/Operations/BrandCreation.service";
import { PlatformEnum } from "../../SocialMedia/Platform";
import moment from "../../../Utils/DateAndTime/index";
import { TwitterSocialMediaAddPost } from "../../../Service/SocialMedia/twitter.api";
import { postToLinkedIn } from "../../../Service/SocialMedia/LinkedinService";
export const addPostQueue = new Queue("LinkedInPost", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
});
export const LinkedInQueueAdd = async (
  content,
  asset,
  brandId,
  userId,
  startTime
) => {
  const delay = startTime - moment().valueOf();
  if (delay > 0) {
    await addPostQueue.add(
      {
        content,
        asset,
        brandId,
        userId,
      },
      { delay }
    );
  } else {
    await addPostQueue.add({
      content,
      asset,
      brandId,
      userId,
      startTime,
    });
  }
};
addPostQueue.process(async (job) => {
  const { content, asset, brandId, userId } = job.data;
  const LinkedInAccount = await getAccount(brandId, PlatformEnum.LINKEDIN);
  const response = await postToLinkedIn(
    content,
    asset,
    LinkedInAccount.account.owner,
    LinkedInAccount.account.token
  );
  const postId = response.id;
  const createPost = await createSocialAccountAddPost(
    PlatformEnum.LINKEDIN,
    brandId,
    content,
    userId,
    postId
  );
});
