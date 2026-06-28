"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

interface Donation {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  sender_account_name: string | null;
  sender_bank_name: string | null;
  proof_file_url: string | null;
  status: string;
  created_at: string;
  campaign_id: string;
}

export default function VerificationPage() {
  const queryClient = useQueryClient();
  const [rejectReason, setRejectReason] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<string | null>(null);

  const { data: donations, isLoading, error } = useQuery({
    queryKey: ["pending-donations"],
    queryFn: async () => {
      const res = await api.get("/admin/donations/pending");
      return res.data as Donation[];
    },
    refetchInterval: 10000,
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: string; reason?: string }) => {
      const res = await api.post(`/admin/donations/${id}/verify`, {
        status,
        rejection_reason: reason,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-donations"] });
      setSelectedDonation(null);
      setRejectReason("");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Error Loading Donations</h2>
          <p className="text-red-600">
            {error instanceof Error ? error.message : "Failed to load pending donations"}
          </p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["pending-donations"] })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Donation Verification</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proof</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations?.map((donation) => (
              <tr key={donation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {donation.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {donation.amount} {donation.currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {donation.payment_method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {donation.sender_account_name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {donation.proof_file_url ? (
                    <a
                      href={donation.proof_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Proof
                    </a>
                  ) : (
                    <span className="text-red-500">Missing</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(donation.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  {selectedDonation === donation.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Rejection reason (optional for approve)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                      <div className="space-x-2">
                        <button
                          onClick={() =>
                            verifyMutation.mutate({
                              id: donation.id,
                              status: "confirmed",
                            })
                          }
                          disabled={verifyMutation.isPending}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            verifyMutation.mutate({
                              id: donation.id,
                              status: "rejected",
                              reason: rejectReason,
                            })
                          }
                          disabled={verifyMutation.isPending || !rejectReason}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDonation(null);
                            setRejectReason("");
                          }}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedDonation(donation.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {donations?.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No pending donations to verify.
          </div>
        )}
      </div>
    </div>
  );
}
