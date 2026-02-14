'use client';

import React from "react"

import Link from 'next/link'
import { LayoutDashboard, FileText, Settings, BarChart3, Upload, LogOut, Zap } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground">NewsCMS</h1>
        </div>

        <nav className="space-y-2 p-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-foreground hover:bg-accent"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>

          <Link
            href="/admin/posts"
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-foreground hover:bg-accent"
          >
            <FileText className="h-5 w-5" />
            Posts
          </Link>

          <Link
            href="/admin/pages"
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-foreground hover:bg-accent"
          >
            <FileText className="h-5 w-5" />
            Pages
          </Link>

          <Link
            href="/admin/trending"
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-foreground hover:bg-accent"
          >
            <BarChart3 className="h-5 w-5" />
            Trending
          </Link>

          <Link
            href="/admin/auto-publish"
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-blue-600 hover:bg-blue-50 font-medium"
          >
            <Zap className="h-5 w-5" />
            AI Auto-Publish
          </Link>

          <Link
            href="/admin/import"
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-foreground hover:bg-accent"
          >
            <Upload className="h-5 w-5" />
            Bulk Import
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-foreground hover:bg-accent"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>

          <button
            onClick={() => {
              document.cookie = 'user_id=; max-age=0'
              window.location.href = '/login'
            }}
            className="mt-8 flex w-full items-center gap-3 rounded-lg px-4 py-2 text-foreground hover:bg-accent"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
