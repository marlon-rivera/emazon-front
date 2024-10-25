import { Brand } from "./brandinterface";
export interface CreateArticle{
    name: string,
    description: string,
    quantity: number,
    price: number,
    categoriesIds: number[],
    brand: Brand
}