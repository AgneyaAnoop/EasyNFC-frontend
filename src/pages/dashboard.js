import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import {
  User,
  Plus,
  Edit,
  Trash2,
  Share2,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  MessageCircle,
  Mail,
  Link as LinkIcon
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedSlug, setCopiedSlug] = useState('');
  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]); 

  const fetchProfiles = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/all`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setProfiles(response.data.profiles);
      setActiveProfile(response.data.activeProfile);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError('Failed to load profiles');
        setLoading(false);
      }
    }
  }, [router]);

  const switchProfile = async (index) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/switch`,
        { profileIndex: index },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setActiveProfile(index);
    } catch (err) {
      setError('Failed to switch profile');
    }
  };

  const copyProfileLink = async (slug) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getLinkIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-400" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-blue-400" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-300" />;
      case 'whatsapp':
        return <MessageCircle className="h-5 w-5 text-green-400" />;
      case 'email':
        return <Mail className="h-5 w-5 text-yellow-400" />;
      case 'website':
        return <Globe className="h-5 w-5 text-purple-400" />;
      default:
        return <LinkIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - EasyNFC</title>
      </Head>

      <div className="min-h-screen bg-gray-900 pb-12">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 bg-red-500 bg-opacity-10 border border-red-400 text-red-400 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Your Profiles</h1>
            {profiles.length < 5 && (
              <button
                onClick={() => router.push('/profile/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Profile
              </button>
            )}
          </div>

          {profiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className={`bg-gray-800 rounded-lg shadow-lg border ${
                    index === activeProfile
                      ? 'border-blue-500'
                      : 'border-gray-700'
                  } p-6`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`bg-blue-500 bg-opacity-20 rounded-full p-3 ${
                        index === activeProfile ? 'ring-2 ring-blue-500' : ''
                      }`}>
                        <User className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h2 className="text-lg font-medium text-white">{profile.name}</h2>
                        <p className="text-sm text-gray-400">{profile.links?.length || 0} links</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyProfileLink(profile.urlSlug)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="Copy profile link"
                    >
                      {copiedSlug === profile.urlSlug ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <Share2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                    {profile.about || 'No description'}
                  </p>

                  {profile.links && profile.links.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Links:</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-400 hover:text-white"
                          >
                            {getLinkIcon(link.platform)}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col space-y-2">
                    {index !== activeProfile && (
                      <button
                        onClick={() => switchProfile(index)}
                        className="w-full px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        Set as Active
                      </button>
                    )}
                    <a
                      href={`/${profile.urlSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-gray-700 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors inline-flex items-center justify-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-200">No profiles yet</h3>
              <p className="mt-1 text-sm text-gray-400">
                Get started by creating your first profile
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/profile/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Profile
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}