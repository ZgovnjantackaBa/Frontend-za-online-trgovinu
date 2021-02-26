import ArticleType from "./ArticleType";

export default class CategoryType{
    categoryId?: number;
    name?: string;
    description?: string;
    items?: ArticleType[];
}