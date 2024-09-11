import ISubscriptionsModel from "../../../Model/Accounting/Subscriptions/ISubscriptionsModel";
import SubscriptionsService from "../../../Service/Accounting/Subscriptions/SubscriptionsService";
import ISubscriptionsController from "./ISubscriptionsController";

class SubscriptionController implements ISubscriptionsController {
    async createAccountingSubscriptions(subscriptionData: ISubscriptionsModel): Promise<ISubscriptionsModel> {
        const subscriptionService = new SubscriptionsService();
        return await subscriptionService.createAccountingSubscriptions(subscriptionData);
    }

    async getAccountingSubscriptions(page: number, limit: number): Promise<ISubscriptionsModel[]> {
        const subscriptionService = new SubscriptionsService();
        return await subscriptionService.getAccountingSubscriptions(page, limit);
    }
}


export default SubscriptionController;