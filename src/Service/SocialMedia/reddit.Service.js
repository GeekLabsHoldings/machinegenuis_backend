import axios from 'axios';
import qs from 'qs';

export const submitRedditPost = async ({token, title, text, subreddit}) => {
    const url = 'https://oauth.reddit.com/api/submit';
    
    // Prepare the x-www-form-urlencoded data using qs
    const postData = qs.stringify({
      api_type: 'json',
      kind: 'self',   // Text post
      title: title,
      text: text,
      sr: subreddit,  // Subreddit name without /r/
    });
  
    try {
      const response = await axios.post(url, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const responseData = response.data
      return {
        ...responseData
        
      };
    } catch (error) {
      console.error('Error submitting to Reddit:', error.response?.data || error.message);
      // Return error details if needed or rethrow
      return {
        error: error.response?.data || error.message
      };
    }
  };
  