import systemError from "../../Utils/Error/SystemError";
 import * as brandService from "../../Service/SocialMedia/setting.service"
import { Request, Response } from 'express';
import BrandsModel from "../../Model/Operations/BrandCreation.model";
import { startSession } from "mongoose";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
import { log } from "console";





// Settings =========================================================
export const addGroup = async (req , res ) => {
    try {
      const result = await brandService.addGroup(req.body.group_id, req.body.group_name, req.body.link,req.body.platform, req.params.id);
      res.json(result);
    } catch (error) {
      console.log(error);
      return systemError.sendError(res, error);
    }
  };


  export const getGroups = async (req, res) => {
    try {
      const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
      const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
      const skip = (page - 1) * limit;
      const result = await brandService.getGroups( skip, limit);
      res.json(result);
    } catch (error) {
      console.log(error);
      return systemError.sendError(res, error);
    }
  };
  
  
  export const getGroupsByBrand = async (req, res) => {
    try {
      const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
      const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
      const skip = (page - 1) * limit;
      const result = await brandService.getGroupsByBrand(req.params.id, skip, limit);
      res.json(result);
    } catch (error) {
      console.log(error);
      return systemError.sendError(res, error);
    }
  };
  
  
  export const deletGroup = async (req, res) => {
    try {
      const result = await brandService.deletGroup(req.params.g_id);
      if(result){
        return res.json(result);
      }
      res.status(404).json({message:"group account"});
    } catch (error) {
      console.log(error);
      return systemError.sendError(res, error);
    }
  };
  
//===============================================================================
export const getAllPosts = async(req, res) =>{
    try {

        const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
        const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit;
        const result = await brandService.getPost(skip, limit);
        if(result){
          return res.json(result);
        }
        res.status(404).json({message:"group account"});
      } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
      }
  }


export const getPostByBrand = async(req, res) =>{
    try {
        const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
        const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit;
        const result = await brandService.getPostsByBrand(req.params.id, skip, limit);
        if(result){
          return res.json(result);
        }
        res.status(404).json({message:"group account"});
      } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
      }
}


export const addPost = async(req, res) =>{
    try {
      log(req.body)
        const {postid, group_id ,content, date, platform, engagement, id} = req.body

        const result = await brandService.addPost(postid, group_id ,content, date, platform, engagement, id);
        if(result){
          return res.json(result);
        }
        res.status(404).json({message:"group account"});
      } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
      }
}


export const deletpost = async(req, res) =>{
    try {
        const result = await brandService.deletPost( req.params.id);
        if(result){
          return res.json(result);
        }
        res.status(404).json({message:"group account"});
      } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
      }
}

//==========================================================================



export const getAllCampaigns = async(req, res) =>{
  try {

      const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
      const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
      const skip = (page - 1) * limit;
      const result = await brandService.getAllCampaigns(skip, limit);
      if(result){
        return res.json(result);
      }
      res.status(404).json({message:"group account"});
    } catch (error) {
      console.log(error);
      return systemError.sendError(res, error);
    }
}


export const getCampaignByBrand = async(req, res) =>{
  try {
      const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
      const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
      const skip = (page - 1) * limit;
      const result = await brandService.getCampaignByBrand(req.params.id, skip, limit);
      if(result){
        return res.json(result);
      }
      res.status(404).json({message:"group account"});
    } catch (error) {
      console.log(error);
      return systemError.sendError(res, error);
    }
}



export const addCampaigns = async(req, res) =>{
  try {
    log(req.body)
      const {status, posts_shared ,content, date, platform, engagement, id} = req.body

      const result = await brandService.addCampaigns(status, posts_shared, content, date, platform, engagement, id);
      if(result){
        return res.json(result);
      }
      res.status(404).json({message:"group account"});
    } catch (error) {
      console.log(error);
      return systemError.sendError(res, error);
    }
}


export const deletCampaigns = async(req, res) =>{
  try {
      const result = await brandService.deletCampaigns( req.params.id);
      if(result){
        return res.json(result);
      }
      res.status(404).json({message:"group account"});
    } catch (error) {
      console.log(error);
      return systemError.sendError(res, error);
    }
}



export const updateCampaigns = async(req, res) =>{
  try {
      const result = await brandService.updateCampaigns( req.params.id);
      if(result){
        return res.json(result);
      }
      res.status(404).json({message:"group account"});
    } catch (error) {
      console.log(error);
      return systemError.sendError(res, error);
    }
}



export async function get_subscripers(req, res) {
  try {
    // console.log(req.body.brand);
    const result = await brandService.GetSubCount(String(req.query.brand));
    res.json(result);
  } catch (error) {
    return systemError.sendError(res, error);
  }
}
