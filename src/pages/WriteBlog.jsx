import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/Navbar';
import { getSession } from '../utils/auth';
import { getPosts, addPost, updatePost } from '../utils/storage';

export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;

    const posts = getPosts();
    const post = posts.find((p) => p.id === id);

    if (!post) {
      navigate('/blogs', { replace: true });
      return;
    }

    if (session.role !== 'admin' && session.userId !== post.authorId) {
      navigate('/blogs', { replace: true });
      return;
    }

    setTitle(post.title || '');
    setContent(post.content || '');
    setLoading(false);
  }, [id, isEditMode, navigate, session]);

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEditMode) {
      updatePost(id, {
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      });
      navigate(`/blog/${id}`, { replace: true });
    } else {
      const newId = uuidv4();
      const post = {
        id: newId,
        title: title.trim(),
        content: content.trim(),
        authorId: session.userId,
        authorName: session.displayName,
        authorRole: session.role,
        createdAt: new Date().toISOString(),
      };
      addPost(post);
      navigate(`/blog/${newId}`, { replace: true });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gradient Header */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-6 sm:p-8 mb-8 shadow">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {isEditMode ? 'Edit Post' : 'Write a New Post'}
            </h1>
            <p className="mt-2 text-white/80 text-sm sm:text-base">
              {isEditMode
                ? 'Update your blog post below.'
                : 'Share your thoughts with the community.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: '' }));
                  }
                }}
                placeholder="Enter your post title"
                className={`mt-1 block w-full rounded-md border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <span className="text-xs text-gray-400">
                  {content.length} characters
                </span>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content) {
                    setErrors((prev) => ({ ...prev, content: '' }));
                  }
                }}
                placeholder="Write your blog content here..."
                rows={12}
                className={`mt-1 block w-full rounded-md border ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-y`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow"
              >
                {isEditMode ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}