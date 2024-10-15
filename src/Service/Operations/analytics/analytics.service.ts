import { Types } from "mongoose";
import { getAccount } from "../BrandCreation.service";
import { TelegramB } from "../../../Controller/SocialMedia/socialMedia.telegram.controller";
import { IFacebookInAccountData, ILinkedInAccountData, IRedditAccountData, ITelegramAccountData, ITwetterAccountData } from "../../../Model/Operations/IPostingAccounts_interface";
const { TwitterApi } = require('twitter-api-v2');
const snoowrap = require('snoowrap');
const axios = require('axios');





export async function TwitterPostInsights(brand:string, postId:string) {
    try {


        const acc = await getAccount(brand,"TWITTER")
        if(acc  && acc.account){
            const account = (acc.account as ITwetterAccountData)
        // Your Twitter API credentials
            const url = `https://api.twitter.com/2/tweets/${postId}?tweet.fields=public_metrics`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${account.BearerToken}`,
                }
            });

            const metrics = response.data.data.public_metrics;
            console.log(`Retweets: ${metrics.retweet_count}`);
            console.log(`Replies: ${metrics.reply_count}`);
            console.log(`Likes: ${metrics.like_count}`);
            console.log(`Quotes: ${metrics.quote_count}`);
                // Note: public metrics and other expanded data won't be available here
            return metrics
    }
    return null
    } catch (error) {
        console.log(error)
    }
}








export async function RedditPostInsights(brand:string, postId:string) {
    try {

        const acc = await getAccount(brand,"REDDIT")
        if(acc  && acc.account){
            const account = (acc.account as IRedditAccountData)
            const r = new snoowrap({
            userAgent: 'geekapp/v1.1.01',
            clientId: account.appID,
            clientSecret: account.appSecret,
            username: account.username,
            password: account.password
            });

        const submission = await r.getSubmission(postId).fetch();
        
        console.log('Post Title:', submission.title);
        console.log('Upvotes:', submission.ups);
        console.log('Downvotes:', submission.downs);
        console.log('Upvote Ratio:', submission.upvote_ratio);
        console.log('Number of Comments:', submission.num_comments);
        console.log('Score:', submission.score);
        
        return submission;
    }
     return null
    } catch (error) {
        console.log(error)
    }
}


export async function TelegramPostInsights(brand:string,chatId:string, postId:string) {
    try {


        const acc = await getAccount(brand,"TELEGRAM")
        if(acc  && acc.account){

            const tb = new TelegramB((acc.account as ITelegramAccountData).token);

            const message = await tb.bot.getChat(chatId);
            console.log(`Channel Name: ${message.title}`);
            console.log(`Channel Username: ${message.username}`);
            
            const messageInfo = await tb.bot.forwardMessage(chatId, chatId, postId);
            console.log(`Message ID: ${messageInfo.message_id}`);
            console.log(`Message Text: ${messageInfo.text}`);
            console.log(`Views: ${messageInfo.views}`);
            
            // Delete the forwarded message
            await tb.bot.deleteMessage(chatId, messageInfo.message_id);
            await tb.cleanUp()
            return messageInfo
        }
        return null

    } catch (error) {
        console.log(error)
    }
}


export async function FacebookPostInsights(brand:string, postId:string) {
    try {

        const acc = await getAccount(brand,"FACEBOOK")
        if(acc  && acc.account){
            const account = (acc.account as IFacebookInAccountData)
        const response = await axios.get(`https://graph.facebook.com/v12.0/${postId}/insights`, {
            params: {
              access_token: account.longAccessToken,
              metric: 'post_impressions,post_engagements,post_reactions_by_type_total'
            }
          });
      
          console.log('Post Insights:', JSON.stringify(response.data, null, 2));
          return response.data;
        }
        return null
    } catch (error) {
        console.log(error)
    }
}


export async function LinkedinPostInsights(brand:string, postId:string) {
    try {

        const acc = await getAccount(brand,"LINKEDIN")
        if(acc  && acc.account){
            
            const account = (acc.account as ILinkedInAccountData)
            console.log(account)
            console.log("accounts  \n\n", account)
            const response = await axios.get(
                `https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${account.owner}&shares[0]=${postId}`,
                {
                headers: {
                    Authorization: `Bearer ${account.token}`,
                },
                }
            );
            console.log(response.data)
            return response.data;
            }
        return null
    } catch (error) {
        console.log(error)
    }
}
