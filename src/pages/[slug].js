// src/pages/[slug].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import {
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
  MessageCircle,
  Link as LinkIcon,
  User,
  FileText,
  Globe,
  Copy,
  Share2
} from 'lucide-react';

const ProfilePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile/public/${slug}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Profile not found');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.name || 'Profile',
          text: `Check out ${profile?.name || 'this'}'s profile`,
          url: window.location.href,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getLinkIcon = (platform) => {
    const platformType = (platform || '').toLowerCase();
    
    switch (platformType) {
      case 'instagram':
        return <Instagram className="h-6 w-6" />;
      case 'linkedin':
        return <Linkedin className="h-6 w-6" />;
      case 'twitter':
      case 'x':
        return <Twitter className="h-6 w-6" />;
      case 'whatsapp':
        return <MessageCircle className="h-6 w-6" />;
      case 'email':
      case 'business email':
        return <Mail className="h-6 w-6" />;
      case 'website':
        return <Globe className="h-6 w-6" />;
      default:
        return <LinkIcon className="h-6 w-6" />;
    }
  };

  const formatPlatformName = (platform) => {
    if (!platform) return 'Link';
    
    switch (platform.toLowerCase()) {
      case 'x':
        return 'Twitter/X';
      case 'business email':
        return 'Business Email';
      default:
        return platform
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
    }
  };

  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getDisplayUrl = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
        <div className="text-red-400 text-xl text-center mb-4">{error}</div>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{profile?.name ? `${profile.name} - Profile` : 'Profile'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="description" content={profile?.about || 'View profile details'} />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Share/Copy Button */}
        <button
          onClick={shareProfile}
          className="fixed top-4 right-4 z-10 p-2 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
          aria-label="Share profile"
        >
          {copied ? 
            <Copy className="h-6 w-6 text-green-400" /> : 
            <Share2 className="h-6 w-6 text-gray-300" />
          }
        </button>

        <div className="max-w-xl mx-auto p-4 pt-16">
          {/* Profile Header */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-4 border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 bg-opacity-20 rounded-full p-3 flex-shrink-0">
                <User className="h-8 w-8 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-white truncate">
                  {profile?.name || 'Anonymous'}
                </h1>
                {profile?.phoneNo && (
                  <p className="text-gray-300 truncate">{profile.phoneNo}</p>
                )}
              </div>
            </div>
            {profile?.about && (
              <div className="mt-4 flex items-start space-x-2">
                <FileText className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{profile.about}</p>
              </div>
            )}
          </div>

          {/* Links Grid */}
          {profile?.links && profile.links.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {profile.links.map((link, index) => {
                if (!link || !link.url || !isValidUrl(link.url)) return null;

                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 rounded-xl shadow-lg p-4 flex items-center space-x-3 hover:bg-gray-750 transition-colors duration-200 border border-gray-700 hover:border-gray-600 active:scale-98 transform"
                  >
                    <div className={`p-2 rounded-xl ${
                      link.isCustom 
                        ? 'bg-purple-500 bg-opacity-10 text-purple-400' 
                        : 'bg-blue-500 bg-opacity-10 text-blue-400'
                    }`}>
                      {getLinkIcon(link.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-white truncate">
                        {link.isCustom 
                          ? (link.customTitle || 'Custom Link') 
                          : formatPlatformName(link.platform)}
                      </h2>
                      <p className="text-sm text-gray-400 truncate">
                        {getDisplayUrl(link.url)}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No links available</p>
            </div>
          )}

          {/* Contact Button */}
          {profile?.phoneNo && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 pt-8">
              <div className="max-w-xl mx-auto">
                <a
                  href={`tel:${profile.phoneNo}`}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 active:scale-98 transform shadow-lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Now
                </a>
              </div>
            </div>
          )}

          {/* Bottom Padding */}
          <div className="h-24"></div>
        </div>

        {/* Toast Message */}
        {copied && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm border border-gray-700">
            Link copied to clipboard!
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;