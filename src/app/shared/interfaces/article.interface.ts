import { Brand } from "./brandinterface";
import { Category } from "./category.interface";
export interface CreateArticle{
    name: string,
    description: string,
    quantity: number,
    price: number,
    categoriesIds: number[],
    brand: Brand
}
export interface Article{
    id: number,
    name: string,
    description: string,
    quantity: number,
    price: number,
    categories: Category[],
    brand: Brand
}