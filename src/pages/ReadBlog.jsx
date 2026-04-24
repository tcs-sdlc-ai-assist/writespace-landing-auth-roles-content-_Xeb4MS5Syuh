import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAvatar } from '../components/Avatar';
import { getSession } from '../utils/auth';
import { getPosts, deletePost } from '../utils/storage';

export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const posts = getPosts();
  const post = posts.find((p) => p.id === id);

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );
    if (confirmed) {
      deletePost(post.id);
      navigate('/blogs', { replace: true });
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${post.id}`);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Post not found
            </h2>
            <p className="mt-2 text-gray-500 max-w-md">
              The blog post you're looking for doesn't exist or may have been
              removed.
            </p>
            <Link
              to="/blogs"
              className="mt-6 inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow"
            >
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canEdit =
    session && (session.role === 'admin' || session.userId === post.authorId);

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const formattedUpdatedDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blogs
          </Link>
        </div>

        {/* Article */}
        <article className="bg-white rounded-lg shadow p-6 sm:p-8">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>

          {/* Author & Date */}
          <div className="mt-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              {getAvatar(post.authorRole)}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {post.authorName || 'Unknown'}
                </p>
                {formattedDate && (
                  <p className="text-xs text-gray-400">{formattedDate}</p>
                )}
              </div>
            </div>
            {formattedUpdatedDate && (
              <span className="text-xs text-gray-400">
                Updated {formattedUpdatedDate}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="mt-6 text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <Link
              to="/blogs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Blogs
            </Link>

            {canEdit && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
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
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}