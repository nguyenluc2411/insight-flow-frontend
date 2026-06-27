import axiosInstance from '@/lib/axios';
import { NewsArticle, NewsArticleRequest, NewsRatingRequest } from '@/types/news.types';

export const NewsService = {
    // --- Admin Endpoints ---
    getAdminArticles: async (params?: any) => {
        const response = await axiosInstance.get('/api/v1/catalog/admin/news', { params });
        return response.data;
    },
    createArticle: async (data: NewsArticleRequest) => {
        const response = await axiosInstance.post('/api/v1/catalog/admin/news', data);
        return response.data;
    },
    updateArticle: async (id: string, data: NewsArticleRequest) => {
        const response = await axiosInstance.put(`/api/v1/catalog/admin/news/${id}`, data);
        return response.data;
    },
    deleteArticle: async (id: string) => {
        const response = await axiosInstance.delete(`/api/v1/catalog/admin/news/${id}`);
        return response.data;
    },

    // --- Public Endpoints ---
    getPublicArticles: async (params?: any) => {
        const response = await axiosInstance.get(`/api/v1/catalog/public/news`, {
            params: { ...params },
        });
        return response.data;
    },
    getPublicArticleById: async (id: string) => {
        const response = await axiosInstance.get(`/api/v1/catalog/public/news/${id}`);
        return response.data;
    },

    // --- Protected User Endpoints ---
    getMyRating: async (id: string): Promise<number> => {
        const response = await axiosInstance.get(`/api/v1/catalog/news/${id}/my-rating`);
        return response.data.ratingValue ?? 0;
    },
    rateArticle: async (id: string, data: NewsRatingRequest) => {
        const response = await axiosInstance.post(`/api/v1/catalog/news/${id}/rate`, data);
        return response.data;
    }
};
