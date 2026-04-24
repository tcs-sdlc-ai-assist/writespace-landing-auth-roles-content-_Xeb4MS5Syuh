import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { getSession } from '../utils/auth';
import { getPosts } from '../utils/storage';

export default function LandingPage() {
  const session = getSession();
  const navigate = useNavigate();
  const posts = getPosts();

  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const handlePostClick = (postId) => {
    if (session) {
      navigate(`/blog/${postId}`);
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: '✍️',
      title: 'Write & Publish',
      description:
        'Create beautiful blog posts with an intuitive editor. Share your thoughts and ideas with the world in just a few clicks.',
      color: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-100',
    },
    {
      icon: '👥',
      title: 'User Management',
      description:
        'Manage authors and editors with role-based access control. Admins can oversee all content and users effortlessly.',
      color: 'from-violet-500 to-violet-600',
      iconBg: 'bg-violet-100',
    },
    {
      icon: '📊',
      title: 'Dashboard & Analytics',
      description:
        'Track your posts and activity with a clean dashboard. Get an overview of your blog at a glance with useful stats.',
      color: 'from-pink-500 to-pink-600',
      iconBg: 'bg-pink-100',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Welcome to <span className="text-yellow-300">WriteSpace</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/90">
            Your creative space to write, share, and discover amazing blog posts.
            Join a community of writers and readers today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <Link
                to={session.role === 'admin' ? '/admin' : '/blogs'}
                className="inline-flex items-center px-8 py-3 text-base font-medium text-indigo-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-3 text-base font-medium text-indigo-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-3 text-base font-medium text-white border-2 border-white/50 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Everything you need to blog
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            WriteSpace provides all the tools you need to create, manage, and share your content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center"
            >
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full ${feature.iconBg} text-3xl mb-5`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Latest Posts
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                Check out what our community has been writing about recently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => {
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

                return (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post.id)}
                    className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 flex flex-col"
                  >
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 flex-1">{excerpt}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                        <span className="text-sm font-medium text-gray-700">
                          {post.authorName || 'Unknown'}
                        </span>
                        {formattedDate && (
                          <span className="text-xs text-gray-400">{formattedDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-xl font-bold text-white tracking-tight">
                ✍️ WriteSpace
              </span>
              <p className="mt-2 text-sm text-gray-400">
                Your creative space to write and share.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}