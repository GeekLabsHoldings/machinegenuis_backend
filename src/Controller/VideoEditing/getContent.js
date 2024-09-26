const mongoose = require("mongoose");
import contentModel from '../../Model/ContentCreation/Content/content_model'

const get_all_content = async (req, res) => {
    const querying = req.query
    const LIMIT = querying.limit;
    const PAGE = querying.page;
    const SKIP = (PAGE - 1) * LIMIT;
    // const userId = req.body.currentUser._id;
    try 
    {
        let content = await contentModel.find({ }, { "__v": false })
            .limit(LIMIT)
            .skip(SKIP);
            
        res.json({message: "successfully" , content});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default get_all_content;
