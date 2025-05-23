"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation items
  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { label: "Posts", path: "/admin/posts", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    )},
    { label: "New Post", path: "/admin/posts/new", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    )},
  ];
  
  const isActive = (path: string) => {
    if (path === "/admin/dashboard" && pathname === "/admin/dashboard") {
      return true;
    }
    if (path === "/admin/posts" && pathname?.startsWith("/admin/posts") && pathname !== "/admin/posts/new") {
      return true;
    }
    if (path === "/admin/posts/new" && pathname === "/admin/posts/new") {
      return true;
    }
    return false;
  };
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/80" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 p-5 transform transition-transform">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-white hover:bg-gray-700 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? "bg-neon-cyan/20 text-neon-cyan"
                          : "text-white/80 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li className="pt-4 mt-4 border-t border-gray-700">
                  <Link
                    href="/"
                    className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="ml-3">Back to Site</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
      
      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
          {/* Sidebar content */}
          <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="px-4 py-6">
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-neon-cyan/20 text-neon-cyan"
                        : "text-white/80 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <Link
                    href="/"
                    className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="ml-3">Back to Site</span>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="lg:pl-64 flex flex-col w-full">
          <main className="flex-1 p-5 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}