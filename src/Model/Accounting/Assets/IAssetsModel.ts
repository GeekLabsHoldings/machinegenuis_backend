export default interface IAssetsModel {
    propertyType: string;
    amountPaid: number;
    sellerPhoneNumber: string;
    dateAcquired: number;
}

interface IRealEstateModel extends IAssetsModel {
    assetAddress: string;
    space: number;
    marketRate: number;
    ratings: number;
}

interface IEquipmentModel extends IAssetsModel {
    equipmentName: string;
}

interface IDigitalAssetModel extends IRealEstateModel {
    assetName: string;
    TTMProfit: number;
    TTMRevenue: number;
}



type AssetsTypes = IRealEstateModel | IEquipmentModel | IDigitalAssetModel;

export { IRealEstateModel, IEquipmentModel, IDigitalAssetModel, AssetsTypes };