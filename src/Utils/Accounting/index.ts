import { Model } from "mongoose";
import { DigitalAssetModel, EquipmentModel, RealEstateModel } from "../../Model/Accounting/Assets/AssetsModel";

enum AssetsTypeEnum {
    RealEstate = 'realState',
    Equipment = 'equipment',
    DigitalAsset = 'digital-asset'
}

const AssetsTypeModelMap = {
    [AssetsTypeEnum.RealEstate]: RealEstateModel,
    [AssetsTypeEnum.Equipment]: EquipmentModel,
    [AssetsTypeEnum.DigitalAsset]: DigitalAssetModel
}
export { AssetsTypeEnum, AssetsTypeModelMap };

