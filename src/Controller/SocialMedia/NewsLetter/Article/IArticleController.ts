export default interface IArticleController {
    getArticleById(article_id: string): Promise<string>;
}