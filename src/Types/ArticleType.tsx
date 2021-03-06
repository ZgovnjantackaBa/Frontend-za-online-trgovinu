export default class ArticleType{
    articleId?: number;
    name?: string;
    excerpt?: string;
    description?: string;
    imageUrl?: string | undefined;
    price?: number;

    categoryId?: number;
    status?: 'avalible' | 'visible' | 'hidden';
    isPromoted?: number;

    category?: {
        categoryId: number;
        name: string;
        imagePath: string;
        parentCategoryId: number;
    };

    articleFeatures?: {
        articleFeatureId: number;
        articleId: number;
        featureId: number;
        value: string;
    }[];

    features?: {
        featureId: number;
        name: string;
    }[];

    articlePrices?: {
        articlePriceid: number;
        price: number;
    }[];

    photos?: {
        photoId: number;
        imagePath: string;
    }[];
}