import ISubscriptionsModel from "../../../Model/Accounting/Subscriptions/ISubscriptionsModel";

export default interface ISubscriptionsService {
    createAccountingSubscriptions(subscriptionData: ISubscriptionsModel): Promise<ISubscriptionsModel>;
    getAccountingSubscriptions(page: number, limit: number): Promise<ISubscriptionsModel[]>;
}