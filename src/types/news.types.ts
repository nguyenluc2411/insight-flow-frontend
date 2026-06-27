export interface NewsArticle {
    id: string;
    title: string;
    summary?: string;
    content: any; // JSON block data
    coverImageUrl?: string;
    authorId: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    averageRating: number;
    ratingCount: number;
}

export interface NewsArticleRequest {
    title: string;
    summary?: string;
    content: any;
    coverImageUrl?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface NewsRatingRequest {
    ratingValue: number;
}
