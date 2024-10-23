import { Types } from "mongoose";
import SocialMediaPosts from "../../../Model/SocialMedia/SocialMediaPosts.models";






export async function getTwitterEngagement(subs: number,brand:string|Types.ObjectId) {
    const engagementData = await SocialMediaPosts.aggregate([
      {$match: {platform:"TWITTER" }},
      {
        $group: {
          _id: { brand: '$brand', brandId: "$brandId", platform: '$platform' },
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
          totalShares: { $sum: '$shares' },
          totalPosts: { $sum: 1 }, // Count total number of posts per group
        },
      },
      {
        $addFields: {
          totalInteractions: {
            $add: ['$totalLikes', '$totalComments', '$totalShares'], // Add interactions
          },
        },
      },
      {
        $addFields: {
          engagement: {
            $multiply: [
              {
                $divide: [
                  '$totalInteractions',
                  { $multiply: [subs, '$totalPosts'] }, // Assuming subs is a variable you define before this query
                ],
              },
              100, // Convert to percentage
            ],
          },
        },
      },
    ]);
  
    return engagementData;
  }