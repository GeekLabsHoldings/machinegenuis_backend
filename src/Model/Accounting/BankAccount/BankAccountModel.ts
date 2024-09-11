import { model, Schema } from 'mongoose';
import IBankAccountModel from './IBankAccountModel';
import { RequiredString, RequiredNumber } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const BankAccountSchema = new Schema<IBankAccountModel>({
    bankName: RequiredString,
    accountNumber: RequiredString,
    accountName: RequiredString,
    ApiConnect: RequiredString,
    brand: RequiredString,
    country: RequiredString,
    IBANumber: RequiredString,
    password: RequiredString,
    SWIFTCode: RequiredString,
    userName: RequiredString,
    createdAt: RequiredNumber
});

const BankAccountModel = model<IBankAccountModel>(SchemaTypesReference.BankAccount, BankAccountSchema);

export default BankAccountModel;