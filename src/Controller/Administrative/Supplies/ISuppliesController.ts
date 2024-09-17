import ISuppliesModel from "../../../Model/Administrative/Supplies/ISuppliesModel";

export default interface ISuppliesController {
    createSupply(supplies: ISuppliesModel): Promise<ISuppliesModel>;
    updateSupply(_id: string, supplyStatus: string): Promise<ISuppliesModel>;
    getAllSupplies(page: number, limit: number, supplyStatus: string | null, type: string | null, subType: string | null): Promise<Record<string, ISuppliesModel[]>>;
    getSupplies(page: number, limit: number): Promise<ISuppliesModel[]>;
}