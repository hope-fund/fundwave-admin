'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

// Axios setup pointing to your deployed FastAPI backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add JWT token to requests dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface PendingDonation {
  id: string
  sender_name: string
  sender_email: string
  amount: number
  currency: string
  campaign_title: string
  proof_of_payment_url: string
  created_at: string
}

export default function VerificationPage() {
  const queryClient = useQueryClient()

  // 1. Fetching the current pending verification queue
  const { data: pendingDonations, isLoading, error } = useQuery<PendingDonation[]>({
    queryKey: ['pending-donations'],
    queryFn: async () => {
      const res = await api.get('/admin/donations/pending')
      return res.data
    }
  })

  // 2. The Verification Action: Writes Ledger Entry, Modifies Balance, Logs Event
  const verifyMutation = useMutation({
    mutationFn: async (donationId: string) => {
      return await api.post(`/admin/donations/${donationId}/verify`)
    },
    onSuccess: () => {
      // Invalidate and refresh the list automatically without a page reload
      queryClient.invalidateQueries({ queryKey: ['pending-donations'] })
    },
    onError: (err: any) => {
      alert(`Ledger Write Rejected: ${err.response?.data?.detail || err.message}`)
    }
  })

  // 3. The Rejection Action: Drops Transaction, Writes Audit Event Only
  const rejectMutation = useMutation({
    mutationFn: async (donationId: string) => {
      return await api.post(`/admin/donations/${donationId}/reject`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-donations'] })
    },
    onError: (err: any) => {
      alert(`Rejection Action Failed: ${err.message}`)
    }
  })

  if (isLoading) return <div className="text-gray-400 p-8 font-mono">Querying database transaction log...</div>
  if (error) return <div className="text-red-400 p-8 font-mono">Engine synchronization error. Check API connection.</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Donation Verification Engine</h2>
          <p className="text-sm text-gray-400 mt-1">Manual reconciliation processing queue. Actions directly mutate the financial ledger.</p>
        </div>
        <div className="mt-4 md:mt-0 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-xs font-mono">
          ⚠️ {pendingDonations?.length || 0} Transactions Awaiting Authorization
        </div>
      </div>

      {pendingDonations?.length === 0 ? (
        <div className="text-center py-12 bg-[#0F1422] rounded-xl border border-gray-800 text-gray-500 font-mono">
          ✓ Reconciliation complete. Queue is clear.
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingDonations?.map((tx) => (
            <div key={tx.id} className="bg-[#0F1422] border border-gray-800 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-400">{tx.id}</span>
                  <span className="text-sm text-gray-500">{new Date(tx.created_at).toLocaleString()}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {tx.currency}
                  </h4>
                  <p className="text-sm text-gray-300">Declared by <span className="font-semibold text-white">{tx.sender_name}</span> ({tx.sender_email})</p>
                  <p className="text-xs text-gray-400 mt-1">Target Account: <span className="text-blue-400 font-medium">{tx.campaign_title}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-3 lg:self-center self-end">
                <a 
                  href={tx.proof_of_payment_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium rounded-lg border border-gray-700 transition"
                >
                  Review Proof
                </a>
                <button 
                  onClick={() => verifyMutation.mutate(tx.id)}
                  disabled={verifyMutation.isPending || rejectMutation.isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-emerald-900/20"
                >
                  {verifyMutation.isPending ? 'Writing Entry...' : 'Verify & Write Entry'}
                </button>
                <button 
                  onClick={() => rejectMutation.mutate(tx.id)}
                  disabled={verifyMutation.isPending || rejectMutation.isPending}
                  className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 disabled:opacity-50 text-red-400 text-sm font-medium rounded-lg border border-red-500/10 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
