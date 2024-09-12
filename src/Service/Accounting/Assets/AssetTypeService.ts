import { Model } from "mongoose";
import { AssetsTypes } from "../../../Model/Accounting/Assets/IAssetsModel";
import AssetsService from "./AssetsService";
import { AssetsTypeEnum } from "../../../Utils/Accounting";

class AssetTypeService extends AssetsService {
    constructor(model: Model<AssetsTypes>) {
        super(model);
    }

    async createAsset(data: Partial<AssetsTypes>): Promise<AssetsTypes> {
        return await super.createAsset(data);
    }

    async getAllAssets(page: number, limit: number): Promise<(AssetsTypes)[]> {
        return await this.getAssets(page, limit) as AssetsTypes[];
    }
}

export default AssetTypeService;