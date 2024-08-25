import { model, Schema } from 'mongoose';
import IEventModel from './IEventModel';
import { SchemaTypesReference } from '../../Utils/Schemas/SchemaTypesReference';
import { NotRequiredString, RefType, RequiredNumber, RequiredString } from '../../Utils/Schemas';

const schema = new Schema<IEventModel>({
    title: RequiredString,
    start: RequiredString,
    end: RequiredString,
    startNumber: RequiredNumber,
    endNumber: RequiredNumber,
    description: NotRequiredString, // role
    articleImg: NotRequiredString,
    articleTitle: NotRequiredString, // candidate name
    backgroundColor: NotRequiredString,
    createdBy: RefType(SchemaTypesReference.Employee, true),
    assignedTo: RefType(SchemaTypesReference.Employee, false)
})

const eventModel = model<IEventModel>(SchemaTypesReference.EVENT, schema);
export default eventModel;