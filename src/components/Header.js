import { useRouter } from 'next/router';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem('token');
    // Redirect to home page
    router.push('/');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-blue-400">
              EasyNFC
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-200 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}