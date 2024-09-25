import { model, Schema } from 'mongoose';
import IAudienceModel from './IAudienceModel';
import { RequiredNumber, RequiredSpecificNumber, RequiredString } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const AudienceSchema = new Schema<IAudienceModel>({
    brand: RequiredString,
    date: RequiredNumber,
    count: RequiredSpecificNumber(1)
});


const AudienceModel = model<IAudienceModel>(SchemaTypesReference.Audiences, AudienceSchema);

export default AudienceModel;