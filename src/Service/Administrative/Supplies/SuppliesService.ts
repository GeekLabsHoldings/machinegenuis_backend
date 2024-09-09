import ISuppliesModel from "../../../Model/Administrative/Supplies/ISuppliesModel";
import SuppliesModel from "../../../Model/Administrative/Supplies/SuppliesModel";
import ISuppliesService from "./ISuppliesService";

class SuppliesService implements ISuppliesService {
    async createSupply(supply: ISuppliesModel): Promise<ISuppliesModel> {
        const newSupply = new SuppliesModel(supply);
        return await newSupply.save();
    }

    async updateSupply(_id: string, supply: ISuppliesModel): Promise<ISuppliesModel | null> {
        return await SuppliesModel.findByIdAndUpdate(_id, supply, { new: true });
    }

    async getAllSupplies(page: number, limit: number, queryType: string | null, type: string | null): Promise<ISuppliesModel[]> {
        let query = {};
        if (queryType) {
            query = { ...query, queryType };
        }
        if (type) {
            query = { ...query, type };
        }
        return await SuppliesModel.find(query).skip(page * limit).limit(limit);
    }
}
const suppliesService = new SuppliesService();
export default suppliesService;