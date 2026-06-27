"use client";
import React, { useEffect, useState } from "react";
import { NewsService } from "@/services/news.service";
import { NewsArticle } from "@/types/news.types";
import Link from "next/link";
import Image from "next/image";

import { useAuthStore } from "@/stores/auth.store";

export default function PublicNewsFeedPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);

    useEffect(() => {
        NewsService.getPublicArticles().then(data => {
            if (data?.content) setArticles(data.content);
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Tin Tức & Cập Nhật Mới Nhất</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Luôn cập nhật những thông tin, phân tích và hướng dẫn mới nhất từ hệ thống của chúng tôi.</p>
                </div>

                {articles.length > 0 && (
                    <div className="mb-16">
                        <Link href={`/news/${articles[0].id}`} className="group relative block rounded-2xl overflow-hidden shadow-2xl transition-transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10"></div>
                            {articles[0].coverImageUrl ? (
                                <img
                                    src={articles[0].coverImageUrl}
                                    alt={articles[0].title}
                                    className="h-[500px] w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="h-[500px] w-full bg-gray-300 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-6xl text-gray-400">image</span>
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                <h2 className="text-4xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{articles[0].title}</h2>
                                <p className="text-gray-200 text-lg line-clamp-2 max-w-3xl">{articles[0].summary}</p>
                            </div>
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {articles.slice(1).map(article => (
                        <Link key={article.id} href={`/news/${article.id}`} className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100">
                            <div className="h-48 bg-gray-200 w-full overflow-hidden">
                                {article.coverImageUrl ? (
                                    <img src={article.coverImageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined text-4xl">image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs font-semibold text-indigo-600 mb-2">TIN TỨC</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 line-clamp-2">{article.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">{article.summary}</p>
                                <div className="flex items-center text-sm text-gray-400 font-medium">
                                    {new Date(article.publishedAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                {articles.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        Hiện chưa có bài viết nào được xuất bản.
                    </div>
                )}
            </div>
        </div>
    );
}
