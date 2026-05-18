const INTEGRATIONS = [
  {
    id: "kiotviet",
    name: "KiotViet",
    icon: "point_of_sale",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
    desc: "Kết nối trực tiếp với quản lý bán hàng KiotViet — tự động đồng bộ đơn hàng và tồn kho",
    status: "available",
    btnLabel: "Kết nối",
    btnClass: "bg-brand-gradient text-white hover:opacity-90",
  },
  {
    id: "sapo",
    name: "Sapo",
    icon: "shopping_cart",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950",
    desc: "Kết nối với Sapo để đồng bộ dữ liệu bán hàng đa kênh",
    status: "available",
    btnLabel: "Kết nối",
    btnClass: "bg-brand-gradient text-white hover:opacity-90",
  },
  {
    id: "shopee",
    name: "Shopee",
    icon: "shopping_bag",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950",
    desc: "Export báo cáo từ Shopee Seller Center và upload để nhận phân tích",
    status: "manual",
    btnLabel: "Hướng dẫn export",
    btnClass: "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50",
  },
  {
    id: "haravan",
    name: "Haravan",
    icon: "language",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
    desc: "Tích hợp với Haravan đang được phát triển — sẽ ra mắt trong Q3 2026",
    status: "coming_soon",
    btnLabel: "Sắp ra mắt",
    btnClass: "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed",
  },
]

export default function IntegrationsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Kết nối & Tích hợp</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Kết nối hệ thống POS/eCommerce để tự động đồng bộ dữ liệu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {INTEGRATIONS.map((integration) => (
          <div
            key={integration.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${integration.bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${integration.color} text-[24px]`}>
                    {integration.icon}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{integration.name}</p>
                  {integration.status === "coming_soon" && (
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      Sắp ra mắt
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              {integration.desc}
            </p>
            <button
              disabled={integration.status === "coming_soon"}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition ${integration.btnClass}`}
            >
              {integration.btnLabel}
            </button>
          </div>
        ))}
      </div>

      {/* Manual Upload CTA */}
      <div className="mt-6 bg-indigo-50 dark:bg-indigo-950 rounded-xl p-5 border border-indigo-100 dark:border-indigo-900 flex items-center gap-4">
        <span className="material-symbols-outlined text-indigo-500 text-3xl">upload_file</span>
        <div className="flex-1">
          <p className="font-semibold text-indigo-800 dark:text-indigo-200">Hoặc tải file thủ công</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            Hỗ trợ CSV, XLSX, JSON từ bất kỳ hệ thống nào
          </p>
        </div>
        <a
          href="/health-check/import"
          className="shrink-0 px-4 py-2 bg-brand-gradient text-white text-sm font-bold rounded-lg hover:opacity-90 transition"
        >
          Tải file
        </a>
      </div>
    </div>
  )
}
