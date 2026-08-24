"use client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);

  // Simulating fetch
  useEffect(() => {
    setRequests([
      { id: '1', user: { name: 'Dr. John Doe', email: 'john@example.com' }, createdAt: new Date().toISOString() },
    ]);
  }, []);

  const handleApprove = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const handleReject = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-[var(--color-bg-primary)]">
      <Navigation />
      <div className="flex-1 max-w-[1280px] w-full mx-auto p-6">
        <h1 className="text-3xl font-display font-bold mb-8 uppercase tracking-widest text-[var(--color-accent-cyan)]">Author Requests</h1>
        
        <div className="glass-card p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="pb-4 font-medium">User</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-white/5">
                  <td className="py-4">
                    <div>
                      <p className="font-semibold">{request.user.name}</p>
                      <p className="text-sm text-gray-400">{request.user.email}</p>
                    </div>
                  </td>
                  <td className="py-4">{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 flex gap-2">
                    <button onClick={() => handleApprove(request.id)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold">Approve</button>
                    <button onClick={() => handleReject(request.id)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-bold">Reject</button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">No pending requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
