import { Model } from "mongoose";
import { AssetsModel } from "../../../Model/Accounting/Assets/AssetsModel";
import { AssetsTypes, IEquipmentModel, IRealEstateModel } from "../../../Model/Accounting/Assets/IAssetsModel";
import { AssetsTypeEnum } from "../../../Utils/Accounting";
import IAssetsService from "./IAssetsService";

class AssetsService implements IAssetsService {

    private assetModel: Model<AssetsTypes>;
    constructor(model: Model<AssetsTypes>) {
        this.assetModel = model;
    }
    async createAsset(data: Partial<AssetsTypes>): Promise<AssetsTypes> {
        const asset = new this.assetModel(data);
        console.log({ asset });
        const result = await asset.save();
        return result;
    }

    async getAssets(page: number, limit: number): Promise<AssetsTypes[]> {
        const assets = await this.assetModel.find().skip(page * limit).limit(limit);
        return assets;
    }

}
export default AssetsService;