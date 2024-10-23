import { model, Schema } from 'mongoose';
import IUserSubscription from './IUserSubscriptionModel';
import { RequiredString, RequiredBoolean, RequiredNumber, RefType } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const UserSubscriptionSchema = new Schema<IUserSubscription>({
    email: RequiredString,
    brand: RefType(SchemaTypesReference.Brands, true),
    subscriptionDate: RequiredNumber,
    subscriptionStatus: RequiredBoolean,
    receivedEmails: RequiredNumber,
    updatedAt: RequiredNumber
});

const UserSubscriptionModel = model<IUserSubscription>(SchemaTypesReference.UserEmailsSubscription, UserSubscriptionSchema);
export default UserSubscriptionModel;