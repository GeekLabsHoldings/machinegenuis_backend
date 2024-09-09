async function TwitterSocialMedia({ content }) {
  const client = new TwitterApi({
    appKey: "iy6xHq3V6jAJgf553lKvP02Yo", 
    appSecret: "bJElvj5GjoXnFApCinIZ9q15TRoHYzPhping730pFSIO3qNLli",
    accessToken: "1833043345876144128-UvvV1h3oA6BYjo3fCLMExaVE3q5G98",
    accessSecret: "9TUf4GGPPEJz8L3QDILMxL3lSd28ZwsMDq4nX2FADVn0h",
  });

  // Define a function to post a tweet
  export async function postTweet() {
    try {
      const tweet = await client.v2.tweet(content);
      console.log("Tweet posted successfully:", tweet);
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  }
}
