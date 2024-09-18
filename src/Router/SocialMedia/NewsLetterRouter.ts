import { Router, Request, Response } from "express";
import SocialMediaNewsLetterController from "../../Controller/SocialMedia/SocialMediaNewsLetterController";
import systemError from "../../Utils/Error/SystemError";
import { INewsLetter } from "../../Controller/SocialMedia/ISocialMediaNewsLetterController";

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
        const newsLetter: INewsLetter = {
            title: req.body.title,
            subjectLine: req.body.subjectLine,
            openingLine: req.body.openingLine,
            articles: req.body.articles,
            brand: req.body.brand,
            stockName: req.body.stockName,
            uploadTime: req.body.uploadTime
        };
        const newsLetterController = new SocialMediaNewsLetterController();
        const result = await newsLetterController.scheduleSendEmails(newsLetter);
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


export default NewsLetterRouter;