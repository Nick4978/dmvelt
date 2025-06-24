// app/dashboard/layout.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Building2,
  LogOut,
  Menu,
  FileText,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) return null;

  const navItems: NavItem[] = [];
  if (user.role === "user") {
    navItems.push(
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: "My Liens",
        href: "/dashboard/liens",
        icon: <FolderKanban size={18} />,
      }
    );
  }

  if (user.role === "admin") {
    navItems.push(
      {
        label: "Liens",
        icon: <FileText size={18} />,
        children: [
          { label: "Show All", href: "/dashboard/liens" },
          { label: "Add New", href: "/dashboard/liens/new" },
          { label: "Find Lien", href: "/dashboard/liens/search" },
        ],
      },
      {
        label: "Dealers",
        icon: <Building2 size={18} />,
        children: [
          { label: "Show All", href: "/dashboard/dealers" },
          { label: "Add New", href: "/dashboard/dealers/new" },
          { label: "Find Dealer", href: "/dashboard/dealers/search" },
        ],
      },
      {
        label: "Users",
        icon: <Users size={18} />,
        children: [
          { label: "Show All", href: "/dashboard/users" },
          { label: "Add New", href: "/dashboard/users/new" },
          { label: "Find Dealer", href: "/dashboard/users/search" },
        ],
      }
    );
  }

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        <h2 className="text-white">
          {user.role === "admin" ? "Admin Menu" : "User Menu"}
        </h2>
        <button
          onClick={() =>
            isMobile ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)
          }
          className="text-white"
        >
          ✕
        </button>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto space-y-2 p-4">
        {navItems.map((item, idx) =>
          item.children ? (
            <NestedNavItem
              key={idx}
              item={item}
              pathname={pathname}
              isCollapsed={isCollapsed}
            />
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${
                pathname === item.href ? "bg-gray-800" : ""
              }`}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        )}
      </nav>

      {/* Sticky logout */}
      <div className="p-4 border-t border-gray-800 text-sm">
        <div className="text-white mb-2">
          Logged in as: <strong>{user.name}</strong>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 py-1 px-3 rounded text-white"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  function NestedNavItem({
    item,
    pathname,
    isCollapsed,
  }: {
    item: any;
    pathname: string;
    isCollapsed: boolean;
  }) {
    const [open, setOpen] = useState(false);

    return (
      <div className="text-white">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${
            open ? "bg-gray-800" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </div>
          {!isCollapsed && <span>{open ? "▲" : "▼"}</span>}
        </button>

        {open && !isCollapsed && (
          <div className="ml-6 mt-1">
            {item.children.map((sub: any) => (
              <Link
                key={sub.href}
                href={sub.href}
                className={`block px-2 py-1 rounded hover:bg-gray-600 text-sm ${
                  pathname === sub.href ? "bg-gray-700" : ""
                }`}
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900 transition-transform duration-300 md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <aside className="w-64 h-full shadow-lg">{sidebarContent(true)}</aside>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 h-screen z-40 w-64
    bg-gray-900 text-white transition-transform duration-300 ${
      isCollapsed ? "-translate-x-full" : "translate-x-0"
    }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 bg-gray-50 min-h-screen transition-all duration-300 ${
          isCollapsed ? "md:ml-0" : "md:ml-64"
        }`}
      >
        {/* Mobile Topbar (hamburger) */}
        <div className="p-4 bg-white shadow flex items-center justify-between">
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsMobileOpen(true);
              } else {
                setIsCollapsed((prev) => !prev);
              }
            }}
            className="text-gray-600"
          >
            <Menu size={24} />
          </button>
          <span />
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
