import ISubscriptionsModel from "../../../Model/Accounting/Subscriptions/ISubscriptionsModel";

export default interface ISubscriptionsController {
    getAccountingSubscriptions(page: number, limit: number): Promise<ISubscriptionsModel[]>;
    createAccountingSubscriptions(subscriptionData: ISubscriptionsModel): Promise<ISubscriptionsModel>;
}