import { model, Schema } from 'mongoose';
import ISuppliesModel from './ISuppliesModel';
import { EnumStringRequired, RequiredNumber, RequiredString } from '../../../Utils/Schemas';
import { SuppliesTypeArr, SuppliesEnumArray, SuppliesStatusEnumArray } from '../../../Utils/Administrative';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const SuppliesSchema = new Schema<ISuppliesModel>({
    supplyName: RequiredString,
    wantedQuantity: RequiredNumber,
    subType: EnumStringRequired(SuppliesEnumArray),
    type: EnumStringRequired(SuppliesTypeArr),
    supplyStatus: EnumStringRequired(SuppliesStatusEnumArray),
    productPrice: RequiredNumber
});


const SuppliesModel = model<ISuppliesModel>(SchemaTypesReference.Supplies, SuppliesSchema);

export default SuppliesModel;