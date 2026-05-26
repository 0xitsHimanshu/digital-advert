"use client";

import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b bg-background/95 px-6 py-4 backdrop-blur">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
