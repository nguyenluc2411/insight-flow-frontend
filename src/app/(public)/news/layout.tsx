import { Header } from "@/components/layout/Header";

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-bg-base dark:bg-bg-dark">
            <Header />
            {children}
        </div>
    );
}
