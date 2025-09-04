'use client';

import { usePathname, useRouter } from "next/navigation";
import { Home, PlusCircle, BarChart2, User, Settings, LogOut } from "lucide-react";
import { logout } from "@/lib/authService"; // login/logout fonksiyonunu buradan import et
import AuthGuard from '@/components/AuthGuard';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // Giriş ve test sayfalarında layout’u atla
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return <>{children}</>;
    }
    const handleLogout = () => {
        logout();         // Token'ları temizle
        router.push("/login"); // Login sayfasına yönlendir
    };


    return (
        <AuthGuard>

            <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
                {/* Üst Bar */}
                <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold tracking-wide">💸 Bütçe Yönetimi</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </header>

                {/* Ana İçerik ve Sidebar */}
                <div className="flex flex-1">
                    {/* Sidebar */}
                    <aside className="w-64 bg-white/90 backdrop-blur-sm border-r px-4 py-6 hidden md:flex flex-col gap-4 shadow-lg">
                        <ul className="space-y-2">
                            {[
                                { href: "/", icon: <Home size={18} />, text: "Anasayfa" },
                                { href: "/expenses", icon: <PlusCircle size={18} />, text: "Harcama Ekle" },

                            ].map((item, idx) => (
                                <li key={idx}>
                                    <a
                                        href={item.href}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 hover:text-indigo-700 transition font-medium"
                                    >
                                        {item.icon} {item.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Ana içerik */}
                    <main className="flex-1 px-6 py-6">
                        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 min-h-[80vh] border border-gray-200">
                            {children}
                        </div>
                    </main>
                </div>

                {/* Alt Bar */}
                <footer className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-inner px-6 py-4 text-center text-sm">
                    © {new Date().getFullYear()} <span className="font-semibold">Bütçe Yönetimi</span> · Tüm hakları saklıdır.
                </footer>
            </div>
        </AuthGuard>

    );
}
