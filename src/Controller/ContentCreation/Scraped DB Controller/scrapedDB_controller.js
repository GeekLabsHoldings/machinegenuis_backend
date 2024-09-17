import mongoose from "mongoose";
import scraped_dataBase from "../../../Model/ContentCreation/Scraped/scraped_model";
import "dotenv/config";
import generatedContentModel from "../../../Model/ContentCreation/Generated/GeneratedContent_Model";
import generatedContentService from "../../../Service/ContentCreation/GeneratedContent/GeneratedContentService";

const getScrapedData = async (brandName, stockName, session) => {
  try {
    const query = { brand: brandName };
    if (stockName) {
      query.stock = stockName;
    }
    const results = await scraped_dataBase
      .find(query)
      .session(session)
      .sort({ time: -1 })
      .limit(100);
    return results;
  } catch (error) {
    console.error("Error occurred:", error);
    throw new Error("Internal Server Error");
  }
};

const get_scraped_fromDB = async (req, res) => {
  try {
    const { brandName, stockName } = req.body;

    const result = await getScrapedData(brandName, stockName);
    return res
      .status(200)
      .json({ msg: "Scraped DB fetched successfully", result });
  } catch (error) {
    return res.status(500).json({ msg: "Error in fetching scraped DB", error });
  }
};

const delete_scraped_fromDB = async (req, res) => {
  try {
    const { brandName, stockName } = req.body;
    const query = { brand: brandName, content: "" };
    if (stockName) {
      query.stock = stockName;
    }

    const results = await scraped_dataBase.deleteMany(query);
    return res
      .status(200)
      .json({
        msg: `All documents with brand: ${brandName} and stock: ${stockName} with empty content deleted successfully.`,
        deletedCount: results.deletedCount,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error in deleting scraped data", error });
  }
};

const delete_data_fromDB = async (req, res) => {
  try {
    const { brandName, stockName } = req.body;
    const query = { brand: brandName };
    if (stockName) {
      query.stock = stockName;
    }

    const results = await scraped_dataBase.deleteMany(query);
    return res
      .status(200)
      .json({
        msg: `All documents with brand: ${brandName} and stock: ${stockName} with empty content deleted successfully.`,
        deletedCount: results.deletedCount,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error in deleting scraped data", error });
  }
};

/////////////////////
const get_generated_fromDB = async (req, res) => {
  try {
    const { brandName, stockName } = req.body;

    const result = await generatedContentService.getGeneratedContentData(
      brandName,
      stockName
    );
    return res
      .status(200)
      .json({ msg: "Generated DB fetched successfully", result });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error in fetching Generated DB", error });
  }
};

export {
  get_scraped_fromDB,
  getScrapedData,
  delete_scraped_fromDB,
  delete_data_fromDB,
  get_generated_fromDB,
};
