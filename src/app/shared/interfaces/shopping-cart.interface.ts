import { Article, ArticleShoppingCart } from "./article.interface"
import { PaginationInfo } from "./pagination-info.interface"

export interface ItemToAddShoppingCart{
    idArticle: number,
    quantity: number
}
export interface ArticlesShoppinCart{
    articles: PaginationInfo<ArticleShoppingCart>,
    totalPrice: number
}