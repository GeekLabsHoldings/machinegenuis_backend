import { Router, Request, Response } from 'express';
import AnalysisNewsLetterController from '../../Controller/SocialMedia/NewsLetter/AnalysisNewsLetter/AnalysisNewsLetterController';
import { AnalyticsType } from '../../Utils/NewsLetter';
import ArticleController from '../../Controller/SocialMedia/NewsLetter/Article/ArticleController';


const unAuthorizerNewsLetterRouter = Router();

unAuthorizerNewsLetterRouter.get('/opening-image/:email/:newLetter_id', async (req: Request, res: Response) => {
    try {

        const { email, newLetter_id } = req.params;
        console.log(`==================User ${email} Open the link================== newLetter_id: ${newLetter_id} =================`);
        res.redirect("https://machine-genius.s3.amazonaws.com/images/1725871410553.png");
        const analysisController = new AnalysisNewsLetterController();
        await analysisController.createNewsLetterAnalysis(newLetter_id, email, "images", AnalyticsType.OPEN);
        return;
    } catch (error) {
        console.log("============= Error opening image =============", { error });
        return;
    }
});

unAuthorizerNewsLetterRouter.get('/article/:article_id/:email/:newLetter_id', async (req: Request, res: Response) => {
    try {
        const { article_id, email, newLetter_id } = req.params;
        console.log(`==================User ${email} Open the link================== article_id: ${article_id} =================`);
        const articleController = new ArticleController();
        const result = await articleController.getArticleById(article_id);
        res.redirect(result);
        const analysisController = new AnalysisNewsLetterController();
        await analysisController.createNewsLetterAnalysis(newLetter_id, email, article_id, AnalyticsType.CLICK);
    } catch (error) {
        console.log("============= Error opening article =============", { error });
        return;
    }
});

export default unAuthorizerNewsLetterRouter;