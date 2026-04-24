import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/Navbar';
import UserRow from '../components/UserRow';
import { getSession } from '../utils/auth';
import { getUsers, addUser, deleteUser } from '../utils/storage';

export default function UserManagement() {
  const session = getSession();
  const navigate = useNavigate();

  const [users, setUsers] = useState(getUsers());
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const hardCodedAdmin = {
    id: 'admin-uuid',
    displayName: 'Admin',
    username: 'admin',
    role: 'admin',
    createdAt: null,
  };

  const allUsers = [hardCodedAdmin, ...users];

  const refreshUsers = () => {
    setUsers(getUsers());
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim() || !username.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername === 'admin') {
      setError('Username already exists.');
      return;
    }

    const currentUsers = getUsers();
    if (currentUsers.some((u) => u.username === trimmedUsername)) {
      setError('Username already exists.');
      return;
    }

    const userObj = {
      id: uuidv4(),
      displayName: displayName.trim(),
      username: trimmedUsername,
      password: password,
      role: role,
      createdAt: new Date().toISOString(),
    };

    addUser(userObj);
    refreshUsers();

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setShowForm(false);
  };

  const handleDelete = (userId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? This action cannot be undone.'
    );
    if (confirmed) {
      deleteUser(userId);
      refreshUsers();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gradient Banner */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-6 sm:p-8 mb-8 shadow">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              User Management 👥
            </h1>
            <p className="mt-2 text-white/80 text-sm sm:text-base">
              Manage all users on the WriteSpace platform.
            </p>
          </div>
        </div>

        {/* Create User Toggle */}
        <div className="mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New User
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Create New User
              </h2>

              {error && (
                <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Display Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter display name"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setError('');
                      setDisplayName('');
                      setUsername('');
                      setPassword('');
                      setRole('user');
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Users List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Users ({allUsers.length})
          </h2>

          {allUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg shadow">
              <div className="text-6xl mb-6">👥</div>
              <h2 className="text-2xl font-semibold text-gray-900">No users yet</h2>
              <p className="mt-2 text-gray-500 max-w-md">
                There are no users registered yet. Create the first one!
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Desktop Table */}
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onDelete={handleDelete}
                      currentSession={session}
                      isProtectedAdmin={user.id === 'admin-uuid'}
                    />
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {allUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onDelete={handleDelete}
                    currentSession={session}
                    isProtectedAdmin={user.id === 'admin-uuid'}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}