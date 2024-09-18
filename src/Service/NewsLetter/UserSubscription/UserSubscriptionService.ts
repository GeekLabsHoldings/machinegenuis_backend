import IUserSubscriptionModel from "../../../Model/NewsLetter/UsersSubscriptions/IUserSubscriptionModel";
import UserSubscriptionModel from "../../../Model/NewsLetter/UsersSubscriptions/UserSubscriptionModel";
import IUserSubscriptionService from "./IUserSubscriptionService";

export default class UserSubscriptionService implements IUserSubscriptionService {
    async createUserSubscription(userData: IUserSubscriptionModel): Promise<IUserSubscriptionModel> {
        const newUserSubscription = new UserSubscriptionModel(userData);
        const result = await newUserSubscription.save();
        return result;
    }
    async getUsersSubscriptionByBrand(brand: string): Promise<IUserSubscriptionModel[]> {
        return await UserSubscriptionModel.find({ brand });
    }
}