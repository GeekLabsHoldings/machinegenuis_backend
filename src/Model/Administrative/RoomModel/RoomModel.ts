import { model, Schema } from 'mongoose';
import IRoomModel from './IRoomModel';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';
import { EnumStringRequired, RequiredBoolean, RequiredString } from '../../../Utils/Schemas';
import { OfficeCleaningEnumArray } from '../../../Utils/Administrative';

const RoomSchema = new Schema<IRoomModel>({
    roomName: RequiredString,
    typeStatus: EnumStringRequired(OfficeCleaningEnumArray),
    warning: RequiredBoolean
});

const RoomModel = model<IRoomModel>(SchemaTypesReference.Room, RoomSchema);

export default RoomModel;