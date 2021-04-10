export default interface CartOrderType {    
    cartId: number;
    createdAt: string;
    cartArticles: {
        quantity: number;
        article: {
            articleId: number;
            name: string;
            excerpt: string;
            status: "available" | "visible" | "hidden";
            isPromoted: number;
            category: {
                categoryId: number;
                name: string;
            },
            articlePrices: {
                createdAt: string;
                price: number;
            }[];
            photos: {
                imagePath: string;
            }[];
        };
    }[];
}
