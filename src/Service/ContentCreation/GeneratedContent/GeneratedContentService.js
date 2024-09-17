import generatedContentModel from "../../../Model/ContentCreation/Generated/GeneratedContent_Model";
class GeneratedContentService {
  async getGeneratedContentData(brandName, stockName) {
    const query = { brand: brandName };
    if (stockName) {
      query.stock = stockName;
    }
    const result = await generatedContentModel.find(query);
    return result;
  }

  async CreateGeneratedContent(data, session) {
    const new_content = new generatedContentModel(data);
    await new_content.save({ session });
    return new_content;
  }

  async deleteGeneratedContent(brandName, stockName, session) {
    const query = { brand: brandName };
    if (stockName) {
      query.stock = stockName;
    }
    await generatedContentModel.deleteMany(query).session(session);
  }
}

const generatedContentService = new GeneratedContentService();
export default generatedContentService;
