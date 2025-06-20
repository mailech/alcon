import React, { useState } from 'react';
import { User } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Camera, 
  Edit3, 
  MapPin, 
  Link, 
  Mail, 
  Phone, 
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  FileText,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  onClose: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onClose }) => {
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || '',
    phone: user.phone || '',
    location: user.location || '',
    website: user.website || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
    twitter: user.twitter || '',
    currentPosition: user.currentPosition || '',
    company: user.company || '',
    experience: user.experience || '',
    skills: user.skills || [],
    interests: user.interests || [],
    achievements: user.achievements || [],
    languages: user.languages || [],
    profileVisibility: user.profileVisibility,
    contactVisibility: user.contactVisibility
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      bio: user.bio || '',
      phone: user.phone || '',
      location: user.location || '',
      website: user.website || '',
      linkedin: user.linkedin || '',
      github: user.github || '',
      twitter: user.twitter || '',
      currentPosition: user.currentPosition || '',
      company: user.company || '',
      experience: user.experience || '',
      skills: user.skills || [],
      interests: user.interests || [],
      achievements: user.achievements || [],
      languages: user.languages || [],
      profileVisibility: user.profileVisibility,
      contactVisibility: user.contactVisibility
    });
    setIsEditing(false);
  };

  const addItem = (field: 'skills' | 'interests' | 'achievements' | 'languages', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      if (field === 'skills') setNewSkill('');
      if (field === 'interests') setNewInterest('');
      if (field === 'achievements') setNewAchievement('');
      if (field === 'languages') setNewLanguage('');
    }
  };

  const removeItem = (field: 'skills' | 'interests' | 'achievements' | 'languages', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleAvatarUpload = () => {
    const url = prompt('Enter image URL for your profile picture:');
    if (url) {
      onUpdateUser({ avatar: url });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} p-6 flex items-center justify-between`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isEditing ? 'Edit Profile' : 'My Profile'}
          </h2>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center space-x-2 px-4 py-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={onClose}
                  className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 ${isDark ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={handleAvatarUpload}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`text-2xl font-bold w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              ) : (
                <div>
                  <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {user.name}
                  </h1>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'alumni' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user.role === 'alumni' ? (
                        <>
                          <GraduationCap className="w-4 h-4 mr-1" />
                          Alumni
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4 mr-1" />
                          Student
                        </>
                      )}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {user.department} • Class of {user.batch}
                    </span>
                  </div>
                  {user.bio && (
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                      {user.bio}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <Mail className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Your location"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <Mail className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Social Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isEditing ? (
                <>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                      className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                      className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="GitHub profile URL"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                      className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Twitter profile URL"
                    />
                  </div>
                </>
              ) : (
                <>
                  {user.linkedin && (
                    <a 
                      href={user.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {user.github && (
                    <a 
                      href={user.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-3 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {user.twitter && (
                    <a 
                      href={user.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-blue-400 hover:text-blue-500"
                    >
                      <Twitter className="w-4 h-4" />
                      <span>Twitter</span>
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Professional Information
            </h3>
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Current Position
                      </label>
                      <input
                        type="text"
                        value={formData.currentPosition}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentPosition: e.target.value }))}
                        className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Your current position"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Your company"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Experience
                    </label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      rows={3}
                      className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Describe your professional experience..."
                    />
                  </div>
                </>
              ) : (
                <>
                  {user.currentPosition && (
                    <div className="flex items-center space-x-3">
                      <Briefcase className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {user.currentPosition} {user.company && `at ${user.company}`}
                      </span>
                    </div>
                  )}
                  {user.experience && (
                    <div>
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Experience</h4>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{user.experience}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Skills */}
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Skills</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('skills', newSkill)}
                      className={`flex-1 px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Add a skill"
                    />
                    <button
                      onClick={() => addItem('skills', newSkill)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                        {skill}
                        <button
                          onClick={() => removeItem('skills', index)}
                          className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No skills added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Interests */}
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Interests</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('interests', newInterest)}
                      className={`flex-1 px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Add an interest"
                    />
                    <button
                      onClick={() => addItem('interests', newInterest)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">
                        {interest}
                        <button
                          onClick={() => removeItem('interests', index)}
                          className="ml-2 text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.interests && user.interests.length > 0 ? (
                    user.interests.map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No interests added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          {isEditing && (
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Privacy Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Profile Visibility
                  </label>
                  <select
                    value={formData.profileVisibility}
                    onChange={(e) => setFormData(prev => ({ ...prev, profileVisibility: e.target.value as 'public' | 'college' | 'friends' }))}
                    className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="public">Public</option>
                    <option value="college">College Only</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Contact Visibility
                  </label>
                  <select
                    value={formData.contactVisibility}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactVisibility: e.target.value as 'public' | 'college' | 'friends' }))}
                    className={`w-full px-3 py-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="public">Public</option>
                    <option value="college">College Only</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;