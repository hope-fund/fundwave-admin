'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [queryClient] = useState(() => new QueryClient())

  const navigation = [
    {
      name: 'Verification Queue',
      href: '/admin/verification',
      icon: '🧾',
    },
    {
      name: 'System Core Logs',
      href: '/admin/logs',
      icon: '📜',
    },
  ]

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-[#0F1422] border-b md:border-b-0 md:border-r border-gray-800 p-5 shrink-0">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
              F
            </div>

            <span className="text-lg font-bold tracking-tight">
              Fundwave Ops
            </span>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </QueryClientProvider>
  )
}
