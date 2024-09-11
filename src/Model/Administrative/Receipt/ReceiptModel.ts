import { model, Schema } from 'mongoose';


import { RequiredString, RequiredNumber, RefType } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';
import IReceiptModel from './IReceiptModel';

const ReceiptSchema = new Schema<IReceiptModel>({
    employee: RefType(SchemaTypesReference.Employee, true),
    receiptUrl: RequiredString,
    totalPrice: RequiredNumber,
    createdAt: RequiredNumber
});

const ReceiptModel = model<IReceiptModel>(SchemaTypesReference.Receipt, ReceiptSchema);

export default ReceiptModel;