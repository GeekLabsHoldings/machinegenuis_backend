import { model, Schema } from 'mongoose';
import { EnumStringNotRequired, RefType, RequiredNumber, RequiredString } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';
import { AnalyticsTypeArray } from '../../../Utils/NewsLetter';
import IAnalyticsModel from './IAnalyticsModel';

const AnalyticsSchema = new Schema<IAnalyticsModel>({
    email_id: RefType(SchemaTypesReference.NewsLetters, true),
    user_id: RefType(SchemaTypesReference.UserEmailsSubscription, true),
    type: EnumStringNotRequired(AnalyticsTypeArray),
    createdAt: RequiredNumber
});

const AnalyticsModel = model<IAnalyticsModel>(SchemaTypesReference.Analytics, AnalyticsSchema);

export default AnalyticsModel;


