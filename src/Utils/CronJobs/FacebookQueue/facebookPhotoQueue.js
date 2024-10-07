import Queue from "bull";
import "dotenv/config";
import { getAccount } from "../../../Service/Operations/BrandCreation.service";
import { PlatformEnum } from "../../SocialMedia/Platform";
import moment from "../../../Utils/DateAndTime/index";
import { postPhotoToFacebook } from "../../../Service/SocialMedia/facebook.service";
import { createSocialAccountAddPost } from "../../../Service/SocialMedia/socialMedia.service";
export const addPostQueue = new Queue("FacebookPostPhoto", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
});
export const FacebookPhotoQueueAdd = async ( content, url, startTime ,brandId ,userId) => {
  const delay = startTime - moment().valueOf();
  if (delay > 0) {
    await addPostQueue.add(
      {
        content, url ,brandId ,userId
      },
      { delay }
    );
  } else {
    await addPostQueue.add({
        content, url ,brandId ,userId
    });
  }
};
addPostQueue.process(async (job) => {
    console.log("here process");
  const {content, url ,brandId ,userId} = job.data;
  const facebookData = await getAccount(brandId, PlatformEnum.FACEBOOK);
  const response = await postPhotoToFacebook({
    accessToken: facebookData.account.token,
    message: content,
    imageUrl: url,
    FACEBOOK_PAGE_ID: facebookData.account.pageID,
  });
  console.log("hhhhhhhhhhreerererfsgrg",response);
  const postId = response.id;
    const createPost = await createSocialAccountAddPost(
      PlatformEnum.FACEBOOK,
      brandId,
      content,
      userId,
      postId
    );
});
