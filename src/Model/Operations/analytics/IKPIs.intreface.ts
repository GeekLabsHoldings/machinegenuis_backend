import { Types } from "mongoose"
import { IBrand } from "../IBrand_interface"


export default interface IKPIs {
    platform: string
    brand:Types.ObjectId|string|IBrand
    timeStamp: number
    postsPerDay: number,
    postsPerWeek: number,
    postsPerMonth: number
}