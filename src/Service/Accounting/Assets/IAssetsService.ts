import { AssetsTypes, IEquipmentModel, IRealEstateModel } from "../../../Model/Accounting/Assets/IAssetsModel";
import { AssetsTypeEnum } from "../../../Utils/Accounting";



export default interface IAssetsService {
    createAsset(data: Partial<AssetsTypes>): Promise<AssetsTypes>
    getAssets(page: number, limit: number): Promise<AssetsTypes[]>
}