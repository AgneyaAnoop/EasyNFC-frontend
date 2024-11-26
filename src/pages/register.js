import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
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
  Link as LinkIcon,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phoneNo: '',
    about: '',
    links: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Format links before sending
      const formattedData = {
        ...formData,
        links: formData.links.map(link => ({
          ...link,
          url: formatLinkValue(link.platform, link.url)
        }))
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{step === 1 ? 'Create Account' : 'Add Your Links'} - EasyNFC</title>
        <meta name="description" content="Create your EasyNFC account" />
      </Head>

      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <h1 className="text-3xl font-extrabold text-blue-400">EasyNFC</h1>
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold text-white">
            {step === 1 ? 'Create your account' : 'Add your social links'}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-500 bg-opacity-10 border border-red-400 text-red-400 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
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
                      id="phoneNo"
                      name="phoneNo"
                      type="tel"
                      required
                      value={formData.phoneNo}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-200">
                    About You
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="about"
                      name="about"
                      rows="3"
                      value={formData.about}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Social Links Form
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">Your Links</h3>
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

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-700"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Sign in instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}