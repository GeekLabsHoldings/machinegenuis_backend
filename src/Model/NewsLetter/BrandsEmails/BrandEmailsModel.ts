import { model, Schema } from 'mongoose';
import IBrandEmails from './IBrandEmailsModel';
import { RequiredNumber, RequiredString } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const BrandEmailsSchema = new Schema<IBrandEmails>({
    email: RequiredString,
    password: RequiredString,
    hosting: RequiredString,
    port: RequiredNumber,
    brand: RequiredString
});

const BrandEmailsModel = model<IBrandEmails>(SchemaTypesReference.BrandEmail, BrandEmailsSchema);

export default BrandEmailsModel;