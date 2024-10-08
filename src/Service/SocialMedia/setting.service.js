//====================================================================
import SocialMediaGroupsModel from "../../Model/SocialMedia/SocialMediaGroups.model";
import SocialPostingAccount from "../../Model/Operations/SocialPostingAccount.model";
import BrandsModel, {SubBrandModel} from "../../Model/Operations/BrandCreation.model";
import SocialMediaPosts from "../../Model/SocialMedia/SocialMediaPosts.models";
import { timeStamp } from "console";





export const addGroup = async (group_id, group_name, link, platform, brand) => {
    try {
      const newgroup =  new SocialMediaGroupsModel({group_id, group_name, link, platform, brand})
      const group = await newgroup.save()
      return group
    } catch (error) {
      console.log(error);
    }
  };
  
  
  export const getGroups = async (skip, limit) => {
    try {
      const brands = await BrandsModel.find({}).skip(skip||0).limit(limit||999999);
      const groups = []
      for(const brand of brands){
         const gs = await SocialMediaGroupsModel.find({brand:brand._id})
         groups.push({brand:brand, groups:gs})   
      }
      return groups
    } catch (error) {
      console.log(error);
    }
  };
  
  
  export const getGroupsByBrand = async (id, skip, limit) => {
    try {
      const brand = await BrandsModel.findById(id).skip(skip||0).limit(limit||999999);
      const gs = await SocialMediaGroupsModel.find({brand:brand?._id})
      return {brand:brand, groups:gs}
    } catch (error) {
      console.log(error);
    }
  };
  
  
  export const deletGroup = async (id) => {
    try {
      const delAccount = await SocialMediaGroupsModel.findByIdAndDelete(id);
      if (delAccount) {
        console.log('Account deleted successfully:', delAccount);
        return delAccount
      } else {
        console.log('No account found with the provided ID.');
        return null
      }
      
    } catch (error) {
      console.log('Error deleting account:', error);
    }
  };



export async function addPost(content, date, platform, engagement, id) {
    try {
        const newpost = SocialMediaPosts({content:content, timestamp:date, platform:platform, brand:id, })
        const post = await newpost.save()
        return post
    } catch (error) {
        console.log(error)
    }
}





export async function deletPost(id) {
    try {
        const delAccount = await SocialMediaPosts.findByIdAndDelete(id);
        if (delAccount) {
          console.log('Account deleted successfully:', delAccount);
          return delAccount
        } else {
          console.log('No account found with the provided ID.');
          return null
        }
        
      } catch (error) {
        console.log('Error deleting account:', error);
      }
}








export async function getPost(skip,limit) {
    try {
        const posts = await SocialMediaPosts.find({}).skip(skip||0).limit(limit||999999);
        return posts
    } catch (error) {
        console.log('Error deleting account:', error);
    }
}





export async function getPostsByBrand(id,skip,limit) {
    try {
        const posts = await SocialMediaPosts.find({brand:id}).skip(skip||0).limit(limit||999999);
        return posts
    } catch (error) {
        console.log('Error deleting account:', error);
    }
}