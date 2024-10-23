import "dotenv/config";
import OpenAiService from "../../Service/OpenAi/OpenAiService";
import { getAccount } from "../../Service/Operations/BrandCreation.service";
import { getTweets } from "../../Service/SocialMedia/tweets_api_mustApprove";
import {
  checkReplyTweet,
  convertToMilliseconds,
  createReply,
  getAllAccounts,
  getAllBrands,
  getPrompt,
} from "../../Service/SocialMedia/tweetsMustApprove";
import { campaignListEnum } from "../../Utils/SocialMedia/campaign";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
import eventEmitter from "../../Utils/EventEmitter/eventEmitter";
import { DepartmentEnum } from "../../Utils/DepartmentAndRoles";
import { redis } from "../../Utils/Redis/redis";
import moment from "moment";
import { addReply } from "../../Service/SocialMedia/twitter.api";
import EmailService from "../../Service/Message/EmailService";
export const tweets = async () => {
  try {
    const brands = await getAllBrands();

    const today = moment().toISOString();
    const openaiService = new OpenAiService();
    const resError = [];

    for (const brand of brands) {
      console.log("brand.brand}", brand.brand_name);
      const twitterData = await getAccount(brand._id, PlatformEnum.TWITTER);
      const accounts = await getAllAccounts(brand._id);
      let skip = parseInt(await redis.get(`${brand.brand_name}_skip`)) || 0;

      for (let i = 0; i < Math.min(accounts.length, 14); i++) {
        const account = accounts[skip];

        const delayBetweenPosts = convertToMilliseconds(
          account.delayBetweenPosts
        );
        const delayBetweenGroups = convertToMilliseconds(
          account.delayBetweenGroups
        );
        const longPauseAfterCount = account.longPauseAfterCount;
        const tweetsPage = await getTweets(
          account.account_id,
          twitterData.account.BearerToken
        );

        if (tweetsPage?.status !== 200) {
          const warningHTMLEmail = () => {
            const message = tweetsPage.title;
            const html = `
          <h1>twitter warning 😊</h1>
          <p>${message}</p>`;
            return html;
          };
          const emailService = new EmailService();
          for (const x of [
            "abdulrahmangeeklab1@gmail.com",
            "mostafageeklabs@gmail.com",
          ])
            await emailService.sendEmail({
              to: x,
              subject: `Twitter brand :${brand.brand_name}🔥`,
              html: warningHTMLEmail(),
            });
        }

        if (tweetsPage.length) {
          let postCount = 0;

          for (const tweet of tweetsPage) {
            const da = moment(tweet.created_at);

            if (da.isSame(today, "day")) {
              const checkReply = await checkReplyTweet(tweet.id);
              if (checkReply) {
                console.log("Exist");
                break;
              }

              const promptData = await getPrompt("TWITTER");
              const prompt = promptData.prompt.replace("[[1]]", tweet.text);
              const result = await openaiService.callOpenAiApi(
                prompt,
                "You are a representative of Machine Genius, a social media organization focused on multiple fields. Provide a brief and relevant comment in response to the input, ensuring clarity and engagement."
              );

              const reply = result.choices[0].message.content;
              if (account.campaignType === campaignListEnum.AUTO_COMMENT) {
                const addComment = await addReply(
                  twitterData.account.ConsumerKey,
                  twitterData.account.ConsumerSecret,
                  twitterData.account.AccessToken,
                  twitterData.account.TokenSecret,
                  reply,
                  tweet.id
                );
                if (addComment.message === "Reply posted successfully") {
                  account.comments = account.comments + 1;
                  await account.save();
                }
              } else if (
                account.campaignType === campaignListEnum.MUST_APPROVE
              ) {
                const data = {
                  tweetId: tweet.id,
                  content: tweet.text,
                  brand: brand._id,
                  reply,
                  accountName: account.userName,
                  campaignType: account.campaignType,
                  profile_image_url: account.profile_image_url,
                };
                await eventEmitter.emit("TwitterNewTweets", data);
              }
              const content = tweet.text;
              await createReply(
                account.sharingList,
                account.userName,
                brand._id,
                reply,
                tweet.id,
                account.campaignType,
                content,
                account._id
              );
              postCount++;
              if (postCount >= longPauseAfterCount) {
                console.log(
                  `Pausing for ${delayBetweenGroups / 60000} minutes`
                );
                await new Promise((resolve) =>
                  setTimeout(resolve, delayBetweenGroups)
                );
                postCount = 0;
              } else {
                console.log(
                  `Delaying for ${
                    delayBetweenPosts / 60000
                  } minutes between posts`
                );
                await new Promise((resolve) =>
                  setTimeout(resolve, delayBetweenPosts)
                );
              }
            }
          }
        }
        skip = (skip + 1) % accounts.length;
      }
      await redis.set(`${brand.brand}_skip`, skip);
    }
    return resError;
  } catch (error) {
    console.log("Error----->", error);
  }
};
