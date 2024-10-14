import Queue from "bull";
import "dotenv/config";
import { getAccount } from "../../../Service/Operations/BrandCreation.service";
import { PlatformEnum } from "../../SocialMedia/Platform";
import moment from "../../DateAndTime/index";
import { textPhotoToFacebook } from "../../../Service/SocialMedia/facebook.service";
import { createSocialAccountAddPost } from "../../../Service/SocialMedia/socialMedia.service";
export const addPostQueue = new Queue("FacebookPost", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
});
export const FacebookQueueAdd = async (content, startTime, brandId, userId) => {
  const delay = startTime - moment().valueOf();
  if (delay > 0) {
    await addPostQueue.add(
      {
        content ,brandId ,userId
      },
      { delay }
    );
  } else {
    await addPostQueue.add({
        content ,brandId ,userId
    });
  }
};
addPostQueue.process(async (job) => {
  const {content ,brandId ,userId } = job.data;
  const facebookData = await getAccount(brandId, PlatformEnum.FACEBOOK);
  const response = await textPhotoToFacebook({
    accessToken: facebookData.account.tokenPage,
    FACEBOOK_PAGE_ID: facebookData.account.pageID,
    message: content,
  });
  const postId = response.id;
    const createPost = await createSocialAccountAddPost(
      PlatformEnum.FACEBOOK,
      brandId,
      content,
      userId,
      postId
    );
});
