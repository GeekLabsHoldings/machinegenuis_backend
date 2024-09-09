import ISuppliesModel from "../../../Model/Administrative/Supplies/ISuppliesModel";

export default interface ISuppliesController {
    createSupply(supplies: ISuppliesModel): Promise<ISuppliesModel>;
    updateSupply(_id: string, supplies: ISuppliesModel): Promise<ISuppliesModel>;
    getAllSupplies(page: number, limit: number, queryType: string | null, type: string | null): Promise<ISuppliesModel[]>;
}