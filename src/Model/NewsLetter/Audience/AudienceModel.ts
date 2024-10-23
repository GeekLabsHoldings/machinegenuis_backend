import { model, Schema } from 'mongoose';
import IAudienceModel from './IAudienceModel';
import { RefType, RequiredNumber, RequiredSpecificNumber, RequiredString } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const AudienceSchema = new Schema<IAudienceModel>({
    brand: RefType(SchemaTypesReference.Brands, true),
    date: RequiredNumber,
    count: RequiredSpecificNumber(1)
});


const AudienceModel = model<IAudienceModel>(SchemaTypesReference.Audiences, AudienceSchema);

export default AudienceModel;