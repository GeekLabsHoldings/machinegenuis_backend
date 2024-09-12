import { AssetsTypes } from "../../../Model/Accounting/Assets/IAssetsModel";
import { AssetsTypeEnum } from "../../../Utils/Accounting";

export default interface IAssetsController {
    createAsset(data: Partial<AssetsTypes>, assetType: AssetsTypeEnum): Promise<AssetsTypes>;
    getAssets(page: number, limit: number, assetType: AssetsTypeEnum): Promise<(AssetsTypes)[]>;
}