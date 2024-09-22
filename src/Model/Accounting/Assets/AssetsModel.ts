import { model, Schema } from 'mongoose';
import IAssetsModel, { IEquipmentModel, IRealEstateModel, IDigitalAssetModel } from './IAssetsModel';
import { RequiredNumber, RequiredString, StringValidation } from '../../../Utils/Schemas';
import { phoneRegex } from '../../../Utils/Regex';
import { ErrorMessages } from '../../../Utils/Error/ErrorsEnum';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';


const AssetsSchema = new Schema<IAssetsModel>({
    propertyType: RequiredString,
    amountPaid: RequiredNumber,
    sellerPhoneNumber: StringValidation(phoneRegex, ErrorMessages.PHONE_NUMBER_NOT_VALID),
    dateAcquired: RequiredNumber,
}, { discriminatorKey: 'assetType', timestamps: true });

const RealEstateSchema = new Schema<IRealEstateModel>({
    assetAddress: RequiredString,
    space: RequiredNumber,
    marketRate: RequiredNumber,
    ratings: RequiredNumber,
});

const EquipmentSchema = new Schema<IEquipmentModel>({
    equipmentName: RequiredString,
});

const DigitalAssetSchema = new Schema<IDigitalAssetModel>({
    assetName: RequiredString,
    assetAddress: RequiredString,
    marketRate: RequiredNumber,
    ratings: RequiredNumber,
    TTMProfit: RequiredNumber,
    TTMRevenue: RequiredNumber,
});




const AssetsModel = model<IAssetsModel>(SchemaTypesReference.Assets, AssetsSchema);
const RealEstateModel = AssetsModel.discriminator<IRealEstateModel>(SchemaTypesReference.RealState, RealEstateSchema);
const EquipmentModel = AssetsModel.discriminator<IEquipmentModel>(SchemaTypesReference.Equipment, EquipmentSchema);
const DigitalAssetModel = AssetsModel.discriminator<IDigitalAssetModel>(SchemaTypesReference.DigitalAsset, DigitalAssetSchema);

export { AssetsModel, RealEstateModel, EquipmentModel, DigitalAssetModel };