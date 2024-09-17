import { Router, Request, Response } from 'express';
import SuppliesController from '../../Controller/Administrative/Supplies/SuppliesController';
import systemError from '../../Utils/Error/SystemError';
import ISuppliesModel from '../../Model/Administrative/Supplies/ISuppliesModel';
import { SuppliesEnum, SuppliesStatusEnum, SuppliesTypeEnum } from '../../Utils/Administrative';

const SuppliesRouter = Router();

SuppliesRouter.post('/', async (req: Request, res: Response) => {
    try {
        const suppliesData: ISuppliesModel = {
            supplyName: req.body.supplyName,
            wantedQuantity: req.body.wantedQuantity,
            subType: req.body.subType,
            type: (req.body.subType === SuppliesEnum.Cleaning ? SuppliesTypeEnum.Cleaning : SuppliesTypeEnum.Food),
            supplyStatus: SuppliesStatusEnum.CheckList,
            productPrice: req.body.productPrice
        }
        const suppliesController = new SuppliesController();
        const result = await suppliesController.createSupply(suppliesData);
        return res.json({ result });
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

SuppliesRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const supplyStatus = req.body.supplyStatus;
        const suppliesController = new SuppliesController();
        const result = await suppliesController.updateSupply(req.params.id, supplyStatus);
        return res.json({ result });
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

SuppliesRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const supplyStatus = req.query.supplyStatus as string || null;
        const type = req.query.type as string || null;
        const subType = req.query.subType as string || null
        const suppliesController = new SuppliesController();
        const result = await suppliesController.getAllSupplies(page, limit, supplyStatus, type, subType);
        return res.json({ result });
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

SuppliesRouter.get('/all', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const suppliesController = new SuppliesController();
        const result = await suppliesController.getSupplies(page, limit);
        return res.json({ result });
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

export default SuppliesRouter;