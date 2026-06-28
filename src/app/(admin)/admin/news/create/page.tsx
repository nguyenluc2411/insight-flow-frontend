"use client";
import React, { useState } from "react";
import { NewsService } from "@/services/news.service";
import { NewsArticleRequest } from "@/types/news.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/lib/axios";

const BlockEditor = dynamic(() => import("@/components/news/BlockEditor"), { ssr: false });

export default function CreateNewsPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [content, setContent] = useState<any>({ blocks: [] });
    const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

    const handleSave = async (publish: boolean) => {
        if (!title.trim()) {
            alert("Title is required!");
            return;
        }

        const data: NewsArticleRequest = {
            title,
            summary,
            coverImageUrl,
            content,
            status: publish ? 'PUBLISHED' : 'DRAFT'
        };

        try {
            await NewsService.createArticle(data);
            router.push('/admin/news');
        } catch (error) {
            console.error("Failed to create article", error);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Create News Article</h1>
                <div className="space-x-4">
                    <Button variant="outline" onClick={() => handleSave(false)}>Save Draft</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => handleSave(true)}>Publish Now</Button>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <Input 
                        placeholder="Article Title..." 
                        className="text-4xl font-bold py-8 border-none shadow-none focus-visible:ring-0 px-0 rounded-none border-b"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <Input 
                        placeholder="Brief summary (optional)" 
                        className="text-lg text-gray-600 border-none shadow-none focus-visible:ring-0 px-0"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Bìa (Cover Image)</label>
                    <div className="flex items-center space-x-4">
                        <Input
                            type="file"
                            accept="image/*"
                            className="max-w-sm"
                            onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const formData = new FormData();
                                    formData.append("image", e.target.files[0]);
                                    try {
                                        const response = await api.post("/api/v1/catalog/admin/news/upload-image", formData);
                                        if (response.data.success) {
                                            setCoverImageUrl(response.data.file.url);
                                        }
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }
                            }}
                        />
                        {coverImageUrl && (
                            <img src={coverImageUrl} alt="Cover" className="h-16 w-16 object-cover rounded" />
                        )}
                    </div>
                </div>
                
                <div className="mt-8">
                    <BlockEditor data={content} onChange={(data) => setContent(data)} />
                </div>
            </div>
        </div>
    );
}
