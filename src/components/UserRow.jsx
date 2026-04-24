import React from 'react';
import { getAvatar } from './Avatar';

const roleBadgeColors = {
  admin: 'bg-red-100 text-red-700',
  editor: 'bg-blue-100 text-blue-700',
  author: 'bg-green-100 text-green-700',
};

export default function UserRow({ user, onDelete, currentSession, isProtectedAdmin }) {
  const isCurrentUser = currentSession && currentSession.userId === user.id;
  const deleteDisabled = isProtectedAdmin || isCurrentUser;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const badgeColor = roleBadgeColors[user.role] || 'bg-gray-100 text-gray-700';

  let deleteTooltip = 'Delete user';
  if (isProtectedAdmin) {
    deleteTooltip = 'Cannot delete the default admin';
  } else if (isCurrentUser) {
    deleteTooltip = 'Cannot delete yourself';
  }

  return (
    <>
      {/* Desktop: table row */}
      <tr className="hidden md:table-row border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div>
              <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
            {user.role}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => onDelete(user.id)}
            disabled={deleteDisabled}
            title={deleteTooltip}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              deleteDisabled
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-red-600 bg-red-50 hover:bg-red-100'
            }`}
          >
            Delete
          </button>
        </td>
      </tr>

      {/* Mobile: card */}
      <div className="md:hidden bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div>
              <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
            {user.role}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          {formattedDate && (
            <span className="text-xs text-gray-400">{formattedDate}</span>
          )}
          <button
            onClick={() => onDelete(user.id)}
            disabled={deleteDisabled}
            title={deleteTooltip}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              deleteDisabled
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-red-600 bg-red-50 hover:bg-red-100'
            }`}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}