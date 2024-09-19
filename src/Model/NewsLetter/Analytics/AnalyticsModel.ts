import { model, Schema } from 'mongoose';
import { EnumStringNotRequired, NotRequiredString, RefType, RequiredNumber, RequiredString } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';
import { AnalyticsTypeArray } from '../../../Utils/NewsLetter';
import IAnalyticsModel from './Analytics';

const AnalyticsSchema = new Schema<IAnalyticsModel>({
    email: RefType(SchemaTypesReference.NewsLetters, true),
    userEmail: RequiredString,
    article_id: NotRequiredString,
    type: EnumStringNotRequired(AnalyticsTypeArray),
    createdAt: RequiredNumber
});

const AnalyticsModel = model<IAnalyticsModel>(SchemaTypesReference.Analytics, AnalyticsSchema);

export default AnalyticsModel;


