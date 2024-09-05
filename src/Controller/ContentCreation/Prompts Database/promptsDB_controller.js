require('dotenv').config()
const verifyToken = require('../../../middleware/ContentCreatorVerification')
const mongoose = require("mongoose");
import promptsModel from '../../../Model/ContentCreation/Prompts/prompts_model'

const get_brand_prompts = async (brandName, type) => {
    try {
        const projection = { _id: 0 }; 

        if (type === "script") {
            projection.script_prompt = 1;
        } else if (type === "title") {
            projection.title_prompt = 1;
        } else if (type === "thumbnail") {
            projection.thumnail_prompt = 1;
        }

        const prompts = await promptsModel.find(
            { brand: brandName }, 
            projection 
        ).lean();

        return prompts;
    } catch (error) {
        console.error('Error fetching prompts:', error);
        throw new Error('Failed to fetch prompts');
    }
};

const get_all_prompts = async (req, res) => {
    const querying = req.query

    console.log(querying)

    const LIMIT = querying.limit;
    const PAGE = querying.page;
    const SKIP = (PAGE - 1) * LIMIT;

    const userId = req.body.currentUser._id;
    try 
    {
        let content = await contentModel.find({ user_id: userId }, { "__v": false })
            .limit(LIMIT)
            .skip(SKIP);
            
        res.json({message: "successfully" , content});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const add_new_prompts = async (req, res) => {
    const { brand, script_prompt, title_prompt, thumnail_prompt} = req.body
    try {
        const new_prompt = new scraped_dataBase({
            brand,
            script_prompt,
            title_prompt, 
            thumnail_prompt
        });
        await new_prompt.save();
    
        res
        .status(200)
        .json({ message: "Prompt added successfully" , new_prompt});

      } catch (error) {
        console.error(`Error saving to database: ${error}`);
        res.status(400).json({error})
      }
};

const update_content = async (req, res) => {
   
}


export
{
    get_brand_prompts,
    add_new_prompts
}