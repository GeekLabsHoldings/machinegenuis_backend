import ISuppliesModel from "../../../Model/Administrative/Supplies/ISuppliesModel";
import SuppliesModel from "../../../Model/Administrative/Supplies/SuppliesModel";
import ISuppliesService from "./ISuppliesService";

class SuppliesService implements ISuppliesService {
    async createSupply(supply: ISuppliesModel): Promise<ISuppliesModel> {
        const newSupply = new SuppliesModel(supply);
        return await newSupply.save();
    }

    async updateSupply(_id: string, supplyStatus: string): Promise<ISuppliesModel | null> {
        return await SuppliesModel.findByIdAndUpdate(_id, { $set: { supplyStatus } }, { new: true });
    }

    async getAllSupplies(page: number, limit: number, supplyStatus: string | null, type: string | null, subType: string | null): Promise<ISuppliesModel[]> {
        const query: any = {};
        if (supplyStatus) query.supplyStatus = supplyStatus;
        if (type) query.type = type;
        if (subType) query.subType = subType;
        return await SuppliesModel.find(query).skip(page * limit).limit(limit);
    }
}
const suppliesService = new SuppliesService();
export default suppliesService;