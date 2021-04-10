export default interface ArticleDto{
    articleId: number;
    name: string;
    except: string;
    description: string;
    imageUrl: string;
    price: number;

    categoryId: number;
    status: 'avalible' | 'visible' | 'hidden';
    isPromoted: number;

    category: {
        categoryId: number;
        name: string;
        imagePath: string;
        parentCategoryId: number;
    };

    articleFeatures: {
        articleFeatureId: number;
        articleId: number;
        featureId: number;
        value: string;
    }[];

    features: {
        featureId: number;
        name: string;
    }[];

    articlePrices: {
        articlePriceid: number;
        price: number;
    }[];

    photos: {
        photoId: number;
        imagePath: string;
    }[];
}