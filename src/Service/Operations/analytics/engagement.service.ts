import SocialMediaPosts from "../../../Model/SocialMedia/SocialMediaPosts.models";





export async function getEngagement(){
    
}


async function getTwitterEngagement(subs: number, noPosts: number) {
    const engagementData = await SocialMediaPosts.aggregate([
      {
        $group: {
          _id: { brand: '$brand', brandId:"$brandId", platform: '$platform' },
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
          totalShares: { $sum: '$shares' },
          totalPosts: { $sum: 1 }, // Count total number of posts per group
        },
      },
      {
        $addFields: {
          totalInteractions: { $sum: ['$totalLikes', '$totalComments', '$totalShares'] },
          engagement: {
            $multiply: [
              { $divide: ['$totalInteractions', { $multiply: [subs, noPosts] }] },
              100,
            ],
          },
        },
      },
    ]);
  
    return engagementData;
  }