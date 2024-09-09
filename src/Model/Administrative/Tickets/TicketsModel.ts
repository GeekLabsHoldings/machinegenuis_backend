import { model, Schema } from 'mongoose';
import ITicketsModel from './ITicketsModel';
import { ticketTypeEnumArray } from '../../../Utils/Administrative';
import { EnumStringRequired, RequiredNumber, RequiredString } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const TicketsSchema = new Schema<ITicketsModel>({
    ticketType: EnumStringRequired(ticketTypeEnumArray),
    subjectLine: RequiredString,
    ticketDescription: RequiredString,
    createdAt: RequiredNumber
});

const TicketsModel = model<ITicketsModel>(SchemaTypesReference.Ticket, TicketsSchema);

export default TicketsModel;
