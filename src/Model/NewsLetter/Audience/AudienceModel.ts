import { model, Schema } from 'mongoose';
import IAudienceModel from './IAudienceModel';
import { RequiredNumber, RequiredString } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const AudienceSchema = new Schema<IAudienceModel>({
    brand: RequiredString,
    date: RequiredNumber,
    count: RequiredNumber
});


const AudienceModel = model<IAudienceModel>(SchemaTypesReference.Audiences, AudienceSchema);

export default AudienceModel;