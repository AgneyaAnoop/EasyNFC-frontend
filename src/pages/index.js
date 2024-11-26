import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Smartphone, Link as LinkIcon, Share2, LogIn, UserPlus } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-400">EasyNFC</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Share Your Digital Identity
          </h2>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-300 sm:text-xl md:mt-5">
            Create and share your professional profile instantly using NFC technology.
          </p>
          {!isAuthenticated && (
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-gray-700 text-base font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg hover:border-gray-600 transition-colors">
              <div className="absolute top-6 right-6">
                <Smartphone className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mt-8 text-lg font-medium text-white">Tap and Share</h3>
              <p className="mt-2 text-sm text-gray-300">
                Share your profile instantly with a simple tap using NFC technology.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg hover:border-gray-600 transition-colors">
              <div className="absolute top-6 right-6">
                <LinkIcon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mt-8 text-lg font-medium text-white">Multiple Profiles</h3>
              <p className="mt-2 text-sm text-gray-300">
                Create different profiles for personal and professional use.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg hover:border-gray-600 transition-colors">
              <div className="absolute top-6 right-6">
                <Share2 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mt-8 text-lg font-medium text-white">Easy Sharing</h3>
              <p className="mt-2 text-sm text-gray-300">
                Share your profiles via NFC, QR code, or direct link.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {!isAuthenticated && (
        <div className="bg-gray-800">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-300">
              Create your digital profile in minutes and start sharing with the world.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Create Your Profile
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} EasyNFC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}