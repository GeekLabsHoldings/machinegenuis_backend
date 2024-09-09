import { model, Schema } from 'mongoose';
import ISuppliesModel from './ISuppliesModel';
import { EnumStringRequired, RequiredNumber, RequiredString } from '../../../Utils/Schemas';
import { queryTypeEnumArray, SuppliesEnumArray } from '../../../Utils/Administrative';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const SuppliesSchema = new Schema<ISuppliesModel>({
    supplyName: RequiredString,
    wantedQuantity: RequiredNumber,
    queryType: EnumStringRequired(queryTypeEnumArray),
    type: EnumStringRequired(SuppliesEnumArray),
    productPrice: RequiredNumber
});


const SuppliesModel = model<ISuppliesModel>(SchemaTypesReference.Supplies, SuppliesSchema);

export default SuppliesModel;