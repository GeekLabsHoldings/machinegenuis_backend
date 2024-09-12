import { Router, Request, Response } from 'express';
import systemError from '../../Utils/Error/SystemError';
import AssetsController from '../../Controller/Accounting/Assets/AssetsController';
import { AssetsTypeEnum } from '../../Utils/Accounting';

const AssetsRouter = Router();


AssetsRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const assetType = req.body.assetType;
        const assetsController = new AssetsController();
        const result = await assetsController.createAsset(data, assetType);
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


AssetsRouter.get('/get', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const assetType = (req.query.assetType as string as AssetsTypeEnum) || AssetsTypeEnum.Equipment;
        const assetsController = new AssetsController();
        const result = await assetsController.getAssets(page, limit, assetType);
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

export default AssetsRouter;