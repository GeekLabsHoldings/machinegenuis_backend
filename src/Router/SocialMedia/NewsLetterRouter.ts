import { Router, Request, Response } from "express";
import SocialMediaNewsLetterController from "../../Controller/SocialMedia/NewsLetter/SendNewsLetterStep/SocialMediaNewsLetterController";
import systemError from "../../Utils/Error/SystemError";
import { INewsLetterRequestBody } from "../../Controller/SocialMedia/NewsLetter/SendNewsLetterStep/ISocialMediaNewsLetterController";
import AnalysisNewsLetterController from "../../Controller/SocialMedia/NewsLetter/AnalysisNewsLetter/AnalysisNewsLetterController";
import AudienceController from "../../Controller/SocialMedia/NewsLetter/Audiences/AudiencesController";
const NewsLetterRouter = Router();

NewsLetterRouter.get('/get-generated-news-letter', async (req: Request, res: Response) => {
    try {
        const brand = req.query.brand as string;
        const stockName = req.query.stockName as string;
        const newsLetterController = new SocialMediaNewsLetterController();
        const result = await newsLetterController.getGeneratedNewsLetter(brand, stockName);
        return res.status(200).json({ result });
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


NewsLetterRouter.post('/generate-titles', async (req: Request, res: Response) => {
    try {
        const articles = req.body.articles;
        const newsLetterController = new SocialMediaNewsLetterController();
        const result = await newsLetterController.generateNewsLetterTitle(articles);
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

NewsLetterRouter.post('/generate-subject-line-opening-line', async (req: Request, res: Response) => {
    try {
        const title = req.body.title;
        const newsLetterController = new SocialMediaNewsLetterController();
        const result = await newsLetterController.generateSubjectLineAndOpeningLine(title);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
});

NewsLetterRouter.post('/send-newsletter', async (req: Request, res: Response) => {
    try {
        const newsLetter: INewsLetterRequestBody = {
            title: req.body.title,
            subjectLine: req.body.subjectLine,
            openingLine: req.body.openingLine,
            articles: req.body.articles,
            brand: req.body.brand,
            uploadTime: req.body.uploadTime,
        };
        const newsLetterController = new SocialMediaNewsLetterController();
        const result = await newsLetterController.scheduleSendEmails(newsLetter);
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


NewsLetterRouter.get('/analysis/:brand', async (req: Request, res: Response) => {
    try {
        const brand = req.params.brand;
        const analysisNewsLetterController = new AnalysisNewsLetterController();
        const result = await analysisNewsLetterController.getNewsLetterAnalysis(brand);
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

NewsLetterRouter.get('/audience-analysis/:brand', async (req: Request, res: Response) => {
    try {
        const brand = req.params.brand;
        const audienceController = new AudienceController();
        const result = await audienceController.getAudiencesAnalysis(brand);
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

NewsLetterRouter.get('/audience-emails/:brand/:queryType', async (req: Request, res: Response) => {
    try {
        const brand = req.params.brand;
        const queryType = req.params.queryType;
        const audienceController = new AudienceController();
        const result = await audienceController.getAudiencesEmails(brand, queryType);
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


export default NewsLetterRouter;