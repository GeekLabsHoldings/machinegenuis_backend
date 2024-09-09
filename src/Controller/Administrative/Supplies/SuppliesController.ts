import ISuppliesModel from "../../../Model/Administrative/Supplies/ISuppliesModel";
import suppliesService from "../../../Service/Administrative/Supplies/SuppliesService";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import ISuppliesController from "./ISuppliesController";

export default class SuppliesController implements ISuppliesController {
    async createSupply(supplies: ISuppliesModel): Promise<ISuppliesModel> {
        const newSupply = await suppliesService.createSupply(supplies);
        return newSupply;
    }

    async updateSupply(_id: string, supplies: ISuppliesModel): Promise<ISuppliesModel> {
        const updatedSupply = await suppliesService.updateSupply(_id, supplies);
        if (updatedSupply === null)
            return systemError.setStatus(404).setMessage(ErrorMessages.SUPPLY_NOT_FOUND).throw();
        return updatedSupply;
    }

    async getAllSupplies(page: number, limit: number, queryType: string | null, type: string | null): Promise<ISuppliesModel[]> {
        const supplies = await suppliesService.getAllSupplies(page, limit, queryType, type);
        return supplies;
    }
}