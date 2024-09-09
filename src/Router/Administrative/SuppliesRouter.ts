import { Router, Request, Response } from 'express';
import SuppliesController from '../../Controller/Administrative/Supplies/SuppliesController';
import systemError from '../../Utils/Error/SystemError';
import ISuppliesModel from '../../Model/Administrative/Supplies/ISuppliesModel';

const SuppliesRouter = Router();

SuppliesRouter.post('/', async (req: Request, res: Response) => {
    try {
        const suppliesData: ISuppliesModel = {
            supplyName: req.body.supplyName,
            wantedQuantity: req.body.wantedQuantity,
            queryType: req.body.queryType,
            type: req.body.type,
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
        const suppliesData: ISuppliesModel = {
            supplyName: req.body.supplyName,
            wantedQuantity: req.body.wantedQuantity,
            queryType: req.body.queryType,
            type: req.body.type,
            productPrice: req.body.productPrice
        }
        const suppliesController = new SuppliesController();
        const result = await suppliesController.updateSupply(req.params.id, suppliesData);
        return res.json({ result });
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

SuppliesRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const queryType = req.query.queryType as string || null;
        const type = req.query.type as string || null;
        const suppliesController = new SuppliesController();
        const result = await suppliesController.getAllSupplies(page, limit, queryType, type);
        return res.json({ result });
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

export default SuppliesRouter;