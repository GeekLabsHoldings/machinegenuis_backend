import { model, Schema } from 'mongoose';
import ISubscriptionsModel from './ISubscriptionsModel';
import { RequiredNumber, RequiredString } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const SubscriptionsSchema = new Schema<ISubscriptionsModel>({
    subscriptionName: RequiredString,
    subscriptionPrice: RequiredNumber,
    startDate: RequiredNumber,
    endDate: RequiredNumber,
    createdAt: RequiredNumber
});

const SubscriptionsModel = model<ISubscriptionsModel>(SchemaTypesReference.Subscription, SubscriptionsSchema);

export default SubscriptionsModel;