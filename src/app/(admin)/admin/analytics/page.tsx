"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { analyticsService } from "@/services/analytics.service"
import { KPICard } from "@/components/common/KPICard"
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton"
import { ErrorState } from "@/components/common/ErrorState"

export default function AdminAnalyticsPage() {
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")
  const [appliedFrom, setAppliedFrom] = useState<string>("")
  const [appliedTo, setAppliedTo] = useState<string>("")

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-funnel", appliedFrom, appliedTo],
    queryFn: () => analyticsService.getAdminFunnel(appliedFrom, appliedTo)
  })

  const handleSearch = () => {
    setAppliedFrom(fromDate)
    setAppliedTo(toDate)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lịch sử Truy cập</h1>
            <p className="text-slate-500 mt-2">Đang tải dữ liệu truy cập...</p>
          </div>
        </div>
        <LoadingSkeleton type="kpi" />
        <LoadingSkeleton type="card" rows={1} />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Lịch sử Truy cập</h1>
        <ErrorState 
          message="Vui lòng kiểm tra lại kết nối hoặc phân quyền." 
          onRetry={refetch} 
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lịch sử Truy cập</h1>
          <p className="text-slate-500 mt-2">Theo dõi lịch sử truy cập và dữ liệu chuyển đổi khách hàng.</p>
        </div>
        
        <div className="flex items-end gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Từ ngày</label>
            <input 
              type="date"
              className="border border-slate-200 rounded-lg px-3 py-2 bg-white text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 h-[40px]"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Đến ngày</label>
            <input 
              type="date"
              className="border border-slate-200 rounded-lg px-3 py-2 bg-white text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 h-[40px]"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSearch}
            className="h-[40px] px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Tra cứu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Tổng truy cập" 
          value={data?.totalVisitors?.toLocaleString() ?? "0"} 
          subtitle="lượt truy cập"
        />
        <KPICard 
          label="Tỷ lệ Đăng ký" 
          value={`${data?.conversionRates?.visitorToRegisterPct ?? 0}%`} 
          subtitle={`${data?.totalRegistered?.toLocaleString() ?? "0"} tài khoản`}
        />
        <KPICard 
          label="Tỷ lệ Trả phí" 
          value={`${data?.conversionRates?.registerToPaidPct ?? 0}%`} 
          subtitle={`${data?.totalPaidCustomers?.toLocaleString() ?? "0"} khách hàng`}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Danh sách truy cập gần đây</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-medium">ID (Session)</th>
                <th className="px-6 py-3 font-medium">Người truy cập</th>
                <th className="px-6 py-3 font-medium">Gói cước</th>
                <th className="px-6 py-3 font-medium">Giờ truy cập</th>
                <th className="px-6 py-3 font-medium">Thời gian dùng</th>
                <th className="px-6 py-3 font-medium">Thiết bị</th>
                <th className="px-6 py-3 font-medium">Vị trí</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.accessHistory && data.accessHistory.length > 0 ? (
                data.accessHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{item.id}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.visitorType === 'Khách vãng lai' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-700'}`}>
                        {item.visitorType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.plan}</td>
                    <td className="px-6 py-4 text-slate-600">{item.accessTime}</td>
                    <td className="px-6 py-4 text-slate-600">{item.duration}</td>
                    <td className="px-6 py-4 text-slate-600">{item.device}</td>
                    <td className="px-6 py-4 text-slate-600">{item.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Chưa có dữ liệu truy cập nào trong khoảng thời gian này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
