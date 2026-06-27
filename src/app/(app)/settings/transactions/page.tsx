"use client";
import React, { useEffect, useState } from "react";
import { billingService } from "@/services/billing.service";
import type { PaymentTransaction, TransactionPage } from "@/types/billing.types";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        billingService.getTransactions(0, 50)
            .then(data => {
                if (data?.content) setTransactions(data.content);
            })
            .catch(err => console.error("Failed to load transactions", err))
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Thành công</span>;
            case 'PENDING':
                return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Đang chờ</span>;
            case 'FAILED':
                return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Thất bại</span>;
            default:
                return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Đang tải lịch sử giao dịch...</div>;
    }

    return (
        <div className="max-w-5xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lịch sử giao dịch</h1>
                <p className="text-sm text-slate-500 mt-1">Quản lý các khoản thanh toán gia hạn gói dịch vụ của bạn.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Mã giao dịch</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Gói đăng ký</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Số tiền</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Trạng thái</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 dark:text-slate-100">{tx.transactionCode || tx.sepayId}</div>
                                        {tx.referenceCode && <div className="text-xs text-slate-500 mt-0.5">Ref: {tx.referenceCode}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                        {tx.packageCode}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-slate-100">
                                        {formatCurrency(tx.amount)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(tx.status)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {new Date(tx.createdAt).toLocaleString('vi-VN')}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        Chưa có giao dịch nào được ghi nhận.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
