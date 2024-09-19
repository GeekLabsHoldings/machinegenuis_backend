import IUserSubscriptionModel from "../../../Model/NewsLetter/UsersSubscriptions/IUserSubscriptionModel";

export default interface IUserSubscriptionService {
    createUserSubscription(userData: IUserSubscriptionModel): Promise<IUserSubscriptionModel>;
    getUsersSubscriptionByBrand(brand: string): Promise<IUserSubscriptionModel[]>;
    countUsersSubscriptionByBrand(brand: string): Promise<number>;
}