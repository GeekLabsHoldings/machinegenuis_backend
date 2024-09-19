import { model, Schema } from 'mongoose';
import { RequiredNumber, RequiredString } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';
import INewsLettersModel from './INewsLettersModel';

const NewsLettersSchema = new Schema<INewsLettersModel>({
    brand: RequiredString,
    title: RequiredString,
    subjectLine: RequiredString,
    openingLine: RequiredString,
    content: RequiredString,
    userSubscriptionCount: RequiredNumber,
    uploadTime: RequiredNumber,
    createdAt: RequiredNumber
}, {
    timestamps: true
});

const NewsLettersModel = model<INewsLettersModel>(SchemaTypesReference.NewsLetters, NewsLettersSchema);

export default NewsLettersModel;