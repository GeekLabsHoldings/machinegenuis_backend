import { model, Schema } from 'mongoose';
import INewsLetters from './INewsLettersModel';
import { RequiredNumber, RequiredString } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const NewsLettersSchema = new Schema<INewsLetters>({
    brand: RequiredString,
    content: RequiredString,
    createdAt: RequiredNumber,
    openingLine: RequiredString,
    subject: RequiredString,
    subjectLine: RequiredString
});

const NewsLettersModel = model<INewsLetters>(SchemaTypesReference.NewsLetters, NewsLettersSchema);

export default NewsLettersModel;