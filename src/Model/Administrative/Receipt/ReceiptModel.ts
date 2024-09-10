import {model, Schema} from 'mongoose';


import {RequiredString, RequiredNumber} from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';
import IReceiptModel from './IReceiptModel';

const ReceiptSchema = new Schema<IReceiptModel>({
    receiptUrl: RequiredString,
    createdAt: RequiredNumber
});

const ReceiptModel = model<IReceiptModel>(SchemaTypesReference.Receipt, ReceiptSchema);

export default ReceiptModel;