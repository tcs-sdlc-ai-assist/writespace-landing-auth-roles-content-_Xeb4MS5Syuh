import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatar } from './Avatar';

const borderColors = [
  'border-indigo-500',
  'border-violet-500',
  'border-pink-500',
  'border-emerald-500',
  'border-amber-500',
  'border-cyan-500',
  'border-rose-500',
  'border-teal-500',
];

export default function BlogCard({ post, session, index = 0 }) {
  const navigate = useNavigate();
  const colorClass = borderColors[index % borderColors.length];

  const canEdit =
    session && (session.role === 'admin' || session.userId === post.authorId);

  const excerpt =
    post.content && post.content.length > 120
      ? post.content.slice(0, 120) + '…'
      : post.content || '';

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const handleCardClick = () => {
    navigate(`/blog/${post.id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/edit/${post.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border-t-4 ${colorClass} flex flex-col`}
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {post.title}
          </h3>
          {canEdit && (
            <button
              onClick={handleEditClick}
              className="flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit post"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-500 flex-1">{excerpt}</p>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            {getAvatar(post.authorRole)}
            <span className="text-sm font-medium text-gray-700">
              {post.authorName || 'Unknown'}
            </span>
          </div>
          {formattedDate && (
            <span className="text-xs text-gray-400">{formattedDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}