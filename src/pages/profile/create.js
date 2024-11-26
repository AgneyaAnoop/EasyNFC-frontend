import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import {
  User,
  Phone,
  FileText,
  Plus,
  Trash,
  AlertCircle,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  MessageCircle,
  Mail,
  Link as LinkIcon,
  ArrowLeft
} from 'lucide-react';

export default function CreateProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phoneNo: '',
    about: '',
    links: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [
        ...formData.links,
        { platform: '', url: '', isCustom: false, customTitle: '' }
      ]
    });
  };

  const removeLink = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    if (field === 'platform' && value === 'custom') {
      newLinks[index] = {
        ...newLinks[index],
        [field]: value,
        isCustom: true
      };
    } else {
      newLinks[index] = {
        ...newLinks[index],
        [field]: value,
        isCustom: newLinks[index].platform === 'custom'
      };
    }
    setFormData({ ...formData, links: newLinks });
  };

  const getPlaceholder = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'instagram':
        return '@username or username';
      case 'twitter':
        return '@username or username';
      case 'whatsapp':
        return 'Phone number (with country code)';
      case 'email':
        return 'email@example.com';
      case 'linkedin':
        return 'Profile URL or username';
      case 'website':
        return 'https://your-website.com';
      case 'custom':
        return 'https://...';
      default:
        return 'Enter value';
    }
  };

  
  
  const formatLinkValue = (platform, value) => {
    if (!value) return '';
    
    value = value.trim();
    switch (platform?.toLowerCase()) {
      case 'instagram':
        value = value.replace('@', '');
        return `https://instagram.com/${value}`;
      case 'twitter':
        value = value.replace('@', '');
        return `https://twitter.com/${value}`;
      case 'whatsapp':
        value = value.replace('+', '').replace(/\D/g, '');
        return `https://wa.me/${value}`;
      case 'email':
        return `mailto:${value}`;
      case 'linkedin':
        return value.startsWith('http') ? value : `https://linkedin.com/in/${value}`;
      default:
        return value.startsWith('http') ? value : `https://${value}`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // Format all links before sending to API
      const formattedData = {
        ...formData,
        links: formData.links.map(link => ({
          ...link,
          url: formatLinkValue(link.platform, link.url)
        }))
      };
  
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/create`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      router.push('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to create profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Profile - EasyNFC</title>
      </Head>

      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Create New Profile</h1>
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center px-3 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-500 bg-opacity-10 border border-red-400 text-red-400 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                  Profile Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter profile name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-200">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNo"
                    id="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="about" className="block text-sm font-medium text-gray-200">
                  About
                </label>
                <div className="mt-1 relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="about"
                    id="about"
                    rows={3}
                    value={formData.about}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about this profile"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white">Social Links</h2>
                  <button
                    type="button"
                    onClick={addLink}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </button>
                </div>

                {formData.links.map((link, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300">{getLinkIcon(link.platform)}</span>
                        <span className="text-sm text-gray-300">Link #{index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <select
                          value={link.platform}
                          onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                          className="block w-full bg-gray-600 border border-gray-500 rounded-md text-white px-3 py-2"
                        >
                          <option value="">Select Platform</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter/X</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="email">Email</option>
                          <option value="website">Website</option>
                          <option value="custom">Custom Link</option>
                        </select>
                      </div>

                      <div>
                        <input
                          type={link.platform === 'email' ? 'email' : 'text'}
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                          className="block w-full bg-gray-600 border border-gray-500 rounded-md text-white px-3 py-2"
                          placeholder={getPlaceholder(link.platform)}
                        />
                      </div>

                      {link.isCustom && (
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={link.customTitle}
                            onChange={(e) => handleLinkChange(index, 'customTitle', e.target.value)}
                            className="block w-full bg-gray-600 border border-gray-500 rounded-md text-white px-3 py-2"
                            placeholder="Enter custom link title"
                          />
                        </div>
                      )}
                    </div>

                    {link.platform && (
                      <p className="text-xs text-gray-400 mt-2">
                        {link.platform === 'whatsapp' && "Enter your phone number with country code (e.g., '1' for US)"}
                        {link.platform === 'instagram' && "Just enter your username without '@' or URL"}
                        {link.platform === 'twitter' && "Enter your username with or without '@'"}
                        {link.platform === 'linkedin' && "Enter your profile URL or username"}
                        {link.platform === 'website' && "Enter the complete URL"}
                        {link.platform === 'email' && "Enter your email address"}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}