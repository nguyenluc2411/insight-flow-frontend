"use client";
import React, { useEffect, useState } from "react";
import { NewsService } from "@/services/news.service";
import { NewsArticle } from "@/types/news.types";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/hooks/use-toast";

const BlockEditor = dynamic(() => import("@/components/news/BlockEditor"), { ssr: false });

export default function PublicNewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [related, setRelated] = useState<NewsArticle[]>([]);
    const [rating, setRating] = useState<number>(0);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [isRating, setIsRating] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const { toast } = useToast();

    useEffect(() => {
        if (!params.id) return;
        const id = params.id as string;

        NewsService.getPublicArticleById(id)
            .then(setArticle)
            .catch(console.error);

        NewsService.getPublicArticles({ size: 4 }).then(data => {
            if (data?.content) {
                setRelated(data.content.filter((a: any) => a.id !== id).slice(0, 3));
            }
        });

        // Load user's existing rating (only if logged in — silently ignore 401)
        if (isAuthenticated) {
            NewsService.getMyRating(id)
                .then(v => { if (v > 0) setRating(v); })
                .catch(() => {});
        }
    }, [params.id, isAuthenticated]);

    const handleRate = async (star: number) => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }
        if (isRating) return;

        setIsRating(true);
        try {
            await NewsService.rateArticle(article!.id, { ratingValue: star });
            setRating(star);
            toast({ title: "Cảm ơn bạn đã đánh giá!", description: `Bạn đã chấm ${star} sao cho bài viết này.` });
        } catch (error: any) {
            const status = error?.response?.status;
            if (status === 401) {
                setShowLoginPrompt(true);
            } else {
                toast({
                    title: "Đánh giá thất bại",
                    description: error?.response?.data?.detail || error?.message || "Có lỗi xảy ra, vui lòng thử lại.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsRating(false);
        }
    };

    if (!article) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
                {/* Main Content Column */}
                <article className="lg:w-2/3">
                    <header className="mb-10">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6 leading-snug">{article.title}</h1>
                        {article.coverImageUrl && (
                            <img src={article.coverImageUrl} alt={article.title} className="w-full h-auto rounded-2xl mb-8 shadow-sm" />
                        )}
                        <p className="text-xl text-gray-500 mb-6">{article.summary}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 font-medium border-b border-gray-100 pb-6">
                            <span>{new Date(article.publishedAt || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span className="flex items-center text-yellow-500">
                                ⭐ {article.averageRating} ({article.ratingCount} lượt đánh giá)
                            </span>
                        </div>
                    </header>

                    {/* Block Editor purely for rendering read-only content */}
                    <div className="prose prose-lg prose-indigo max-w-none">
                        <BlockEditor data={article.content} onChange={() => {}} readOnly={true} />
                    </div>

                    {/* Rating Section */}
                    <div className="mt-16 pt-8 border-t border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Đánh giá bài viết này</h3>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => handleRate(star)}
                                    disabled={isRating}
                                    className={`text-3xl transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                </article>

                {/* Sidebar - Related News */}
                <aside className="lg:w-1/3">
                    <div className="sticky top-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider border-b border-gray-900 pb-2">Tin Liên Quan</h3>
                        <div className="space-y-8">
                            {related.map(rel => (
                                <div key={rel.id} className="group cursor-pointer" onClick={() => router.push(`/news/${rel.id}`)}>
                                    <div className="h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden"></div>
                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 line-clamp-2 leading-snug">{rel.title}</h4>
                                    <p className="text-sm text-gray-500 mt-2 font-medium">{new Date(rel.publishedAt || '').toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Khoan đã!</h3>
                        <p className="text-gray-600 mb-8">Bạn cần đăng nhập để có thể đánh giá và để lại bình luận cho bài viết này.</p>
                        <div className="flex justify-end space-x-4">
                            <Button variant="ghost" onClick={() => setShowLoginPrompt(false)}>Hủy</Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => router.push('/login')}>Tiếp tục tới Đăng nhập</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
