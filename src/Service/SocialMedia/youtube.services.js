import { google } from "googleapis";
import moment from "moment";


export default class YouTubeAnalytics {
    constructor(account) {
    const oAuth2Client = new google.auth.OAuth2(
            account.client_id, account.client_secret, account.redirect_uris);
        oAuth2Client.setCredentials( account.token);
      this.youtube = google.youtube({
        version: 'v3',
        auth: oAuth2Client
      });
    }
  
    /**
     * Get analytics for a specific time period
     * @param {string} period - Time period ('day', 'week', or 'month')
     * @param {Date} [endDate] - End date (defaults to current date)
     * @returns {Promise<Object>} Analytics data
     */


    async getMyChannel() {
        const response = await this.youtube.channels.list({
          part: 'id,snippet',
          mine: true
        });
    
        if (!response.data.items.length) {
          throw new Error('No channel found for authenticated user');
        }
    
        return response.data.items[0];
      }

    async getAnalytics( period = 'day', endDate = new Date()) {
      try {
        const endMoment = moment(endDate);
        const startMoment = moment(endDate);
        const c_id = await this.getMyChannel()
        // Set start date based on period
        switch (period.toLowerCase()) {
          case 'day':
            startMoment.subtract(1, 'days').startOf('day');
            break;
          case 'week':
            startMoment.subtract(1, 'weeks').startOf('day');
            break;
          case 'month':
            startMoment.subtract(1, 'months').startOf('day');
            break;
          default:
            throw new Error('Invalid period. Use "day", "week", or "month"');
        }
        
        const videos = await this.getVideosInDateRange(
            c_id, 
          startMoment.toISOString(), 
          endMoment.toISOString()
        );
  
        const stats = await this.getVideoStats(videos);
  
        return {
          period: period,
          startDate: startMoment.format('YYYY-MM-DD'),
          endDate: endMoment.format('YYYY-MM-DD'),
          videoCount: videos.length,
          totalViews: stats.totalViews,
          averageViews: stats.averageViews,
        };
      } catch (error) {
        console.error('Error getting analytics:', error.message);
        throw error;
      }
    }
  
    /**
     * Get all videos published in a date range
     * @param {string} channelId - YouTube channel ID
     * @param {string} startDate - Start date in ISO format
     * @param {string} endDate - End date in ISO format
     * @returns {Promise<string[]>} Array of video IDs
     */
    async getVideosInDateRange(channelId, startDate, endDate) {
      const videos = [];
      let nextPageToken = null;
  
      do {
        const response = await this.youtube.search.list({
          part: 'id',
          channelId: channelId,
          maxResults: 50,
          order: 'date',
          type: 'video',
          publishedAfter: startDate,
          publishedBefore: endDate,
          pageToken: nextPageToken
        });
  
        videos.push(...response.data.items.map(item => item.id.videoId));
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);
  
      return videos;
    }
  
    /**
     * Get view statistics for videos
     * @param {string[]} videoIds - Array of video IDs
     * @returns {Promise<Object>} Video statistics
     */
    async getVideoStats(videoIds) {
      let totalViews = 0;
      const viewsByVideo = [];
  
      // Process videos in chunks of 50 (API limit)
      for (let i = 0; i < videoIds.length; i += 50) {
        const chunk = videoIds.slice(i, i + 50);
        const response = await this.youtube.videos.list({
          part: 'statistics,snippet',
          id: chunk.join(',')
        });
  
        response.data.items.forEach(video => {
          const views = parseInt(video.statistics.viewCount) || 0;
          totalViews += views;
        });
      }
  
      const averageViews = videoIds.length > 0 ? 
        Math.round(totalViews / videoIds.length) : 0;
  
      return {
        totalViews,
        averageViews,
      };
    }
  }
  
  // Example usage showing different time periods
  async function main() {
    try {
      const apiKey = 'YOUR_API_KEY';
      const channelId = 'YOUR_CHANNEL_ID';
      const analytics = new YouTubeAnalytics(apiKey);
  
      // Get analytics for different time periods
      const dailyStats = await analytics.getAnalytics('day');
      const weeklyStats = await analytics.getAnalytics('week');
      const monthlyStats = await analytics.getAnalytics('month');
  
      console.log('\nDaily Statistics:');
      console.log(`Videos posted: ${dailyStats.videoCount}`);
      console.log(`Total views: ${dailyStats.totalViews}`);
      console.log(`Average views per video: ${dailyStats.averageViews}`);
  
      console.log('\nWeekly Statistics:');
      console.log(`Videos posted: ${weeklyStats.videoCount}`);
      console.log(`Total views: ${weeklyStats.totalViews}`);
      console.log(`Average views per video: ${weeklyStats.averageViews}`);
  
      console.log('\nMonthly Statistics:');
      console.log(`Videos posted: ${monthlyStats.videoCount}`);
      console.log(`Total views: ${monthlyStats.totalViews}`);
      console.log(`Average views per video: ${monthlyStats.averageViews}`);
  
      // Print detailed stats for each video in the period
      console.log('\nDetailed Video Statistics:');
      monthlyStats.viewsByVideo.forEach(video => {
        console.log(`\nTitle: ${video.title}`);
        console.log(`Views: ${video.views}`);
        console.log(`Published: ${moment(video.publishedAt).format('YYYY-MM-DD HH:mm:ss')}`);
      });
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
