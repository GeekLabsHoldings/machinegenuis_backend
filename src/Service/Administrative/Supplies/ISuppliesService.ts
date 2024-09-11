import ISuppliesModel from "../../../Model/Administrative/Supplies/ISuppliesModel";

export default interface ISuppliesService {
    createSupply(supply: ISuppliesModel): Promise<ISuppliesModel>;
    updateSupply(_id: string, supplyStatus: string): Promise<ISuppliesModel | null>;
    getAllSupplies(page: number, limit: number, supplyStatus: string | null, type: string | null, subType: string | null): Promise<ISuppliesModel[]>;
}