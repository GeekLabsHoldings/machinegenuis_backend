import { model, Schema } from 'mongoose';
import IUserSubscription from './IUserSubscriptionModel';
import { RequiredString, RequiredBoolean, RequiredNumber } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const UserSubscriptionSchema = new Schema<IUserSubscription>({
    email: RequiredString,
    brand: RequiredString,
    subscriptionDate: RequiredNumber,
    subscriptionStatus: RequiredBoolean
});

const UserSubscriptionModel = model<IUserSubscription>(SchemaTypesReference.UserEmailsSubscription, UserSubscriptionSchema);
export default UserSubscriptionModel;