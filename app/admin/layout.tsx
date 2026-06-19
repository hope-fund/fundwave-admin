import React from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-gray-100">
      {/* Sidebar Operations Console */}
      <aside className="w-64 border-r border-gray-800 bg-[#0F1422] p-6 hidden md:flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-wider text-blue-500">FUNDWAVE // OPS</h1>
          <p className="text-xs text-gray-500 uppercase mt-1 tracking-widest">Financial Control</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <a href="/admin/verification" className="flex items-center space-x-3 bg-blue-600/10 text-blue-400 p-3 rounded-lg border border-blue-500/20 font-medium text-sm">
            <span>⚡</span>
            <span>Donation Verification</span>
          </a>
          <a href="/admin/campaigns" className="flex items-center space-x-3 text-gray-400 hover:text-gray-200 p-3 rounded-lg text-sm transition">
            <span>📁</span>
            <span>Campaign Control</span>
          </a>
          <a href="/admin/payouts" className="flex items-center space-x-3 text-gray-400 hover:text-gray-200 p-3 rounded-lg text-sm transition">
            <span>🏦</span>
            <span>Payout Engine</span>
          </a>
          <a href="/admin/ledger" className="flex items-center space-x-3 text-gray-400 hover:text-gray-200 p-3 rounded-lg text-sm transition">
            <span>📜</span>
            <span>Ledger Explorer</span>
          </a>
        </nav>

        <div className="pt-4 border-t border-gray-800 text-xs text-gray-500">
          Role: <span className="text-emerald-400 font-mono font-bold">finance_officer</span>
        </div>
      </aside>

      {/* Main Operational Window */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
