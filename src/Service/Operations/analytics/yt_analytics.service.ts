import { accountDataType, IYoutubeAccountData } from "../../../Model/Operations/IPostingAccounts_interface";
import { getAccount, addOrDeleteAccount } from "../BrandCreation.service";
import { youtubeAnalytics } from "googleapis/build/src/apis/youtubeAnalytics";
import { GetSubCount } from "../../SocialMedia/setting.service";
const { google } = require('googleapis');
const youtube = google.youtube('v3');

const SCOPES = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
    'https://www.googleapis.com/auth/yt-analytics.readonly',
  ];

export async function getData(brand:string, startDate:string, endDate:string, dimensions:string="day") {
    try {
        const acc = await getAccount(brand,"YOUTUBE")
        const account = (acc?.account as IYoutubeAccountData)
        //console.log("this is ", account, brand)
        const oAuth2Client = new google.auth.OAuth2(
            account.client_id, account.client_secret, account.redirect_uris);
            oAuth2Client.setCredentials( {
                access_token: account.tokenY?.access_token,
            });

        // console.log("brands  \n\n\n", account);
        
        const youtubeAnalytics = google.youtubeAnalytics('v2');
        //console.log("youtube\n\n\n\n", account)
         
        const response = await youtubeAnalytics.reports.query({
          auth: oAuth2Client,
          ids: 'channel==MINE',  // Change 'MINE' to the channel ID if necessary
          startDate: startDate,
          endDate: endDate,
          metrics: 'views,likes,comments,averageViewDuration,subscribersGained',//            ,estimatedRevenue,estimatedAdRevenue
          dimensions: "day",
          sort: 'day',
        });
        
        const rows =  {brand:brand,data:response.data.rows}
        console.log("youtube2\n\n\n\n" , rows)
        return rows
    } catch (error) {
     console.log(error);
    } 
 }
 
 export async function getChannelInfo(brand:string) {


        const acc = await getAccount(brand,"YOUTUBE")
        const account = (acc?.account as IYoutubeAccountData)
        const oAuth2Client = new google.auth.OAuth2(
            account.client_id, account.client_secret, account.redirect_uris);
            oAuth2Client.setCredentials( {
                access_token: account.tokenY?.access_token,
            });

        const response = await youtube.channels.list({
            auth: oAuth2Client,
            mine: true, 
            //id: "UCudBuoivh_X4NbJIoARMHVg",
    // or use 'forUsername' for username
            part: 'id,statistics', // Specify the parts you want
        });
    
        const channels = response.data.items;
        if (!channels || channels.length === 0) {
            console.log('No channel found.');
        } else {
            const channel = channels[0];
            console.log('Channel id:', channel.id);
            console.log('Channel etag:', channel.etag);
            console.log('Subscribers:', channel.statistics.subscriberCount);
            console.log('Total Views:', channel.statistics.viewCount);
            console.log('Video Count:', channel.statistics.videoCount);
            return channel
        }
       
 
 }
 
 export async function generateAuthUrl(brand:string) {

        const acc = await getAccount(brand,"YOUTUBE")
        const account = (acc?.account as IYoutubeAccountData)
        const oAuth2Client = new google.auth.OAuth2(
            account.client_id, account.client_secret, account.redirect_uris);
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
          });
          console.log('Authorize this app by visiting this url:', authUrl);

        return authUrl

 }

 export async function updateAccessTokens(brand:string, code:string) {

       const acc = await getAccount(brand,"YOUTUBE")
       let account = (acc?.account as IYoutubeAccountData)
       const oAuth2Client = new google.auth.OAuth2(
        account.client_id, account.client_secret, account.redirect_uris);
        
        console.log(" logging    \n\n\n", account, code)
        oAuth2Client.getToken(code, async (err: string, token: {
            access_token: string;
            scope: string;
            token_type: string;
            expiry_date: number;
          }) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            console.log(" logging2    \n\n\n", account)
            const newccount:accountDataType = {platform:"YOUTUBE", account:{...account, tokenY:token}}
            const updatedAcc = await addOrDeleteAccount(brand, newccount)
    
           return updatedAcc
        });

}