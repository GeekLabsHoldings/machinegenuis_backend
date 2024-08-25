import mongoose from "mongoose";
import scraped_dataBase from "../../../Model/ContentCreation/Scraped/scraped_model";
import 'dotenv/config';

const getScrapedData = async (brandName, stockName) => {
    try {
        const query = { brand: brandName };
        if (stockName) {
            query.stock = stockName;
        }
        const results = await scraped_dataBase.find(query);
        return results.reverse().slice(0, 50);
    } catch (error) {
        console.error("Error occurred:", error);
        throw new Error("Internal Server Error");
    }
};

const get_scraped_fromDB = async (req, res) => {
    try {
        const { brandName, stockName } = req.body;

        const result = await getScrapedData(brandName, stockName);
        return res.status(200).json({ msg: "Scraped DB fetched successfully", result });
    } catch (error) {
        return res.status(500).json({ msg: "Error in fetching scraped DB", error });
    }
};

export { get_scraped_fromDB, getScrapedData };
