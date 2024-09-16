import { Model } from "mongoose";
import { AssetsTypes } from "../../../Model/Accounting/Assets/IAssetsModel";
import AssetTypeService from "../../../Service/Accounting/Assets/AssetTypeService";
import { AssetsTypeEnum, AssetsTypeModelMap } from "../../../Utils/Accounting";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import IAssetsController from "./IAssetsController";

export default class AssetsController implements IAssetsController {
    async createAsset(data: Partial<AssetsTypes>, assetType: AssetsTypeEnum): Promise<AssetsTypes> {
        const assetModel = AssetsTypeModelMap[assetType];
        if (!assetModel) {
            return systemError.setStatus(400).setMessage(ErrorMessages.ASSET_TYPE_NOT_EXIST).throw();
        }
        console.log({ assetType, assetModel });
        const assetService = new AssetTypeService(assetModel as Model<AssetsTypes>);
        return await assetService.createAsset(data);
    }

    async getAssets(page: number, limit: number, assetType: AssetsTypeEnum): Promise<(AssetsTypes)[]> {
        const assetModel = AssetsTypeModelMap[assetType];
        if (!assetModel) {
            return systemError.setStatus(400).setMessage(ErrorMessages.ASSET_TYPE_NOT_EXIST).throw();
        }
        const assetService = new AssetTypeService(assetModel as Model<AssetsTypes>);
        return await assetService.getAllAssets(page, limit);
    }
}