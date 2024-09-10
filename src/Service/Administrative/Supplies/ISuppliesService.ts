import ISuppliesModel from "../../../Model/Administrative/Supplies/ISuppliesModel";

export default interface ISuppliesService {
    createSupply(supply: ISuppliesModel): Promise<ISuppliesModel>;
    updateSupply(_id: string, supply: ISuppliesModel): Promise<ISuppliesModel | null>;
    getAllSupplies(page: number, limit: number, queryType: string | null, type: string | null): Promise<ISuppliesModel[]>;
}