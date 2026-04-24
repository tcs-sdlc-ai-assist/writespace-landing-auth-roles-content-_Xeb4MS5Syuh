import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import { getSession } from '../utils/auth';
import { getPosts } from '../utils/storage';

export default function Home() {
  const session = getSession();
  const posts = getPosts();

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Blog Posts</h1>
        </div>

        {sortedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-semibold text-gray-900">
              No posts yet
            </h2>
            <p className="mt-2 text-gray-500 max-w-md">
              It looks like there are no blog posts yet. Be the first to share
              your thoughts with the community!
            </p>
            <Link
              to="/write"
              className="mt-6 inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                session={session}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}