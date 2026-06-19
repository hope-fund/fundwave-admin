'use strict'
import React from 'react'

// Dummy pending transaction queues awaiting ledger authorization
const mockPendingDonations = [
  {
    id: "tx_98231",
    sender: "Alex Mercer",
    email: "alex@mercer.com",
    amount: "5,000.00 NGN",
    campaign: "Clean Water Initiative",
    proofUrl: "#",
    date: "2026-06-19 10:14"
  },
  {
    id: "tx_98232",
    sender: "Jane Doe",
    email: "jane@doe.com",
    amount: "12,500.00 NGN",
    campaign: "Medical Emergency Fund #4",
    proofUrl: "#",
    date: "2026-06-19 10:28"
  }
]

export default function VerificationPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Donation Verification Engine</h2>
          <p className="text-sm text-gray-400 mt-1">Manual reconciliation processing queue. Actions directly mutate the financial ledger.</p>
        </div>
        <div className="mt-4 md:mt-0 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-xs font-mono">
          ⚠️ {mockPendingDonations.length} Transactions Pending Verification
        </div>
      </div>

      {/* Verification Queue List */}
      <div className="grid gap-4">
        {mockPendingDonations.map((tx) => (
          <div key={tx.id} className="bg-[#0F1422] border border-gray-800 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-400">{tx.id}</span>
                <span className="text-sm text-gray-500">{tx.date}</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{tx.amount}</h4>
                <p className="text-sm text-gray-300">Declared by <span className="font-semibold text-white">{tx.sender}</span> ({tx.email})</p>
                <p className="text-xs text-gray-400 mt-1">Target Account: <span className="text-blue-400 font-medium">{tx.campaign}</span></p>
              </div>
            </div>

            {/* Action Operations Controller */}
            <div className="flex items-center gap-3 lg:self-center self-end">
              <a href={tx.proofUrl} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium rounded-lg border border-gray-700 transition text-center">
                Review Proof
              </a>
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-emerald-900/20">
                Verify & Write Entry
              </button>
              <button className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 text-sm font-medium rounded-lg border border-red-500/10 transition">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
