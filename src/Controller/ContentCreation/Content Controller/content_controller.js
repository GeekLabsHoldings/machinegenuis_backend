require('dotenv').config()
const verifyToken = require('../../../middleware/ContentCreatorVerification')
const mongoose = require("mongoose");
import { reverse } from 'dns';
import contentModel from '../../../Model/ContentCreation/Content/content_model'


const get_all_content = async (req, res) => {
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

        content = content.reverse(); 
        res.json({message: "successfully" , content});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const add_new_content = async (req, res) => {
    const { content_title, content, brand, content_type, views, date, approvals, movie, SEO } = req.body;

    const user_id = req.currentUser._id;
    const user_name = req.currentUser.email
    console.log("userID", user_id);

    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGO_URL);
        }

        const db = mongoose.connection.useDb("test");
        const employeesCollection = db.collection("employees");

        const emp_exist = await employeesCollection.findOne({ _id: new mongoose.Types.ObjectId(user_id) });
        if (!emp_exist) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const content_exist = await contentModel.findOne({ content_title });
        if (content_exist) {
            return res.status(400).json({ message: "Content already exists" });
        }


        const new_content = new contentModel({
            user_id,
            user_name,
            content_title,
            content,
            brand,
            content_type,
            views,
            date,
            approvals,
            movie,
            SEO
        });

        await new_content.save();
        return res.status(201).json({ message: "successfully", new_content });

    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const update_content = async (req, res) => {
    let content_id = req.params.id;

    // find the index of this content 
    const content = await contentModel.findById(content_id)

    if (!content) {
        return res.status(404).send({ message: "The content with the given ID was not found." })
    }
    // merge the old data with the new data that the user want to change    
    const result = await contentModel.updateOne({ _id: content_id }, { $set: { ...req.body } });

    const new_content = await contentModel.findById(content_id)
    res.json(new_content);
}

const delete_content = async (req, res) => {
    try {
        let content_id = req.params.id;
        const content = await contentModel.findByIdAndDelete(content_id);
        if (content) {
            res.json({ message: 'This Content has been deleted Successfully', content });
        } else {
            ;
            res.status(404).send({ message: "This Content does not exist" });
        }
    } catch (error) {
        console.error("Error deleting Content:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const delete_all_content = async (req, res) => {
    try {
        const result = await contentModel.deleteMany({})
        if (result) {
            res.json({ message: 'All Contents has been deleted Successfully' });
        }
    } catch (error) {
        console.error("Error deleting Content:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}


export
    {
        get_all_content,
        add_new_content,
        update_content,
        delete_content,
        delete_all_content
    }