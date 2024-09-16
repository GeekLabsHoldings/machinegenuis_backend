import ISubscriptionsModel from "../../../Model/Accounting/Subscriptions/ISubscriptionsModel";
import SubscriptionsModel from "../../../Model/Accounting/Subscriptions/SubscriptionsModel";
import ISubscriptionsService from "./ISubscriptionsService";

class SubscriptionsService implements ISubscriptionsService {
    async createAccountingSubscriptions(subscriptionData: ISubscriptionsModel): Promise<ISubscriptionsModel> {
        const newSubscription = new SubscriptionsModel(subscriptionData);
        const result = await newSubscription.save();
        return result;
    }

    async getAccountingSubscriptions(page: number, limit: number): Promise<ISubscriptionsModel[]> {
        const result = await SubscriptionsModel.find().skip(page * limit).limit(limit);
        return result;
    }
}




export default SubscriptionsService;