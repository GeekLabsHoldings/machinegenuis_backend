import { Types } from "mongoose";
import { IBrand } from "../../Operations/IBrand_interface";

export default interface IAudienceModel {
    brand: Types.ObjectId | string | IBrand;
    date: number;
    count: number;
}