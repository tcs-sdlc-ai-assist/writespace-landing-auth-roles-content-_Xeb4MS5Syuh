import React from 'react';

export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-200 text-base">
        👑
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200 text-base">
      📖
    </span>
  );
}

export function AvatarChip({ role, displayName }) {
  return (
    <span className="inline-flex items-center gap-2">
      {getAvatar(role)}
      <span className="text-sm font-medium text-gray-700">{displayName}</span>
    </span>
  );
}