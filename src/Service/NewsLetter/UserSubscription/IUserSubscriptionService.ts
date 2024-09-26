import IUserSubscriptionModel from "../../../Model/NewsLetter/UsersSubscriptions/IUserSubscriptionModel";

export default interface IUserSubscriptionService {
    createUserSubscription(userData: IUserSubscriptionModel): Promise<IUserSubscriptionModel>;
    getUsersSubscriptionByBrand(brand: string): Promise<IUserSubscriptionModel[]>;
    countUsersSubscriptionByBrand(brand: string): Promise<number>;
    unSubscribeUser(email: string, brand: string, updatedAt: number): Promise<void>;
    countUsersByBrandAndDate(brand: string, startDate: number): Promise<any>;
    addReceivedEmails(email: string, brand: string): Promise<void>;
    getUsersReceivedEmails(brand: string): Promise<IUserSubscriptionModel[]>;
}