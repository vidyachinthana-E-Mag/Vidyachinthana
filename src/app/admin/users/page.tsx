'use client';
import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetPassId, setResetPassId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    setUsers(users.map((u: any) => u.id === id ? { ...u, role: newRole } : u) as any);
  };

  const handlePasswordReset = async (id: string) => {
    if (!newPassword) return;
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword })
    });
    setResetPassId(null);
    setNewPassword('');
    alert('Password reset successfully');
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-8 w-full">
        <h1 className="text-3xl font-serif font-bold mb-6">User Management</h1>
        
        {loading ? <p>Loading users...</p> : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-transparent border border-slate-300 dark:border-slate-700 rounded p-1"
                      >
                        <option value="READER">READER</option>
                        <option value="AUTHOR">AUTHOR</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="OWNER">OWNER</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {resetPassId === user.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            placeholder="New password" 
                            className="border p-1 text-xs rounded"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                          />
                          <button onClick={() => handlePasswordReset(user.id)} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Save</button>
                          <button onClick={() => setResetPassId(null)} className="text-slate-500 text-xs">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setResetPassId(user.id)} className="text-blue-600 hover:underline text-xs">Reset Password</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
