'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/u/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?._id,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      alert(data.message || 'Password changed');
    } catch (err) {
      console.error(err);
      alert('Failed to change password');
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      alert('Please confirm before deleting.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/u/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?._id }),
      });

      const data = await res.json();
      alert(data.message || 'Account deleted');
      window.location.href = '/'; // redirect home or logout
    } catch (err) {
      console.error(err);
      alert('Failed to delete account');
    }
    setLoading(false);
  };

  const isCredentialUser = session?.user?.provider === 'credentials';

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      {isCredentialUser && (
        <div className="space-y-4 border p-4 rounded">
          <h2 className="text-lg font-medium">Change Password</h2>
          <input
            type="password"
            placeholder="Old Password"
            className="w-full p-2 border rounded"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      )}

      <div className="space-y-4 border p-4 rounded">
        <h2 className="text-lg font-medium text-[#FFBF00]">Delete Account</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.checked)}
          />
          I understand that this action is permanent.
        </label>
        <button
          onClick={handleDeleteAccount}
          disabled={!deleteConfirm || loading}
          className="bg-[#FFBF00] text-white px-4 py-2 rounded hover:bg-[#FFBF00] cursor-pointer"
        >
          {loading ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}
