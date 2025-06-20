import React, { useState } from 'react';
import { User } from '../types';
import { Plus, Briefcase, Calendar, MapPin, DollarSign, Users, Clock, Edit, Trash2 } from 'lucide-react';

interface AlumniOpportunitiesProps {
  user: User;
}

interface Opportunity {
  id: string;
  type: 'job' | 'event' | 'internship';
  title: string;
  company?: string;
  description: string;
  location: string;
  date?: Date;
  salary?: string;
  requirements?: string[];
  applicationLink?: string;
  postedBy: string;
  postedAt: Date;
  isActive: boolean;
}

const AlumniOpportunities: React.FC<AlumniOpportunitiesProps> = ({ user }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: '1',
      type: 'job',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      description: 'We are looking for an experienced software engineer to join our growing team.',
      location: 'San Francisco, CA',
      salary: '$140,000 - $180,000',
      requirements: ['5+ years experience', 'React/Node.js', 'System design'],
      applicationLink: 'https://techcorp.com/careers',
      postedBy: user.name,
      postedAt: new Date('2024-01-15'),
      isActive: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'job' as 'job' | 'event' | 'internship',
    title: '',
    company: '',
    description: '',
    location: '',
    date: '',
    time: '',
    salary: '',
    requirements: '',
    applicationLink: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOpportunity: Opportunity = {
      id: editingId || Date.now().toString(),
      type: formData.type,
      title: formData.title,
      company: formData.company || undefined,
      description: formData.description,
      location: formData.location,
      date: formData.date ? new Date(formData.date) : undefined,
      salary: formData.salary || undefined,
      requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : undefined,
      applicationLink: formData.applicationLink || undefined,
      postedBy: user.name,
      postedAt: editingId ? opportunities.find(o => o.id === editingId)?.postedAt || new Date() : new Date(),
      isActive: true
    };

    if (editingId) {
      setOpportunities(opportunities.map(o => o.id === editingId ? newOpportunity : o));
    } else {
      setOpportunities([newOpportunity, ...opportunities]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'job',
      title: '',
      company: '',
      description: '',
      location: '',
      date: '',
      time: '',
      salary: '',
      requirements: '',
      applicationLink: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (opportunity: Opportunity) => {
    setFormData({
      type: opportunity.type,
      title: opportunity.title,
      company: opportunity.company || '',
      description: opportunity.description,
      location: opportunity.location,
      date: opportunity.date ? opportunity.date.toISOString().split('T')[0] : '',
      time: '',
      salary: opportunity.salary || '',
      requirements: opportunity.requirements?.join('\n') || '',
      applicationLink: opportunity.applicationLink || ''
    });
    setEditingId(opportunity.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      setOpportunities(opportunities.filter(o => o.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setOpportunities(opportunities.map(o => 
      o.id === id ? { ...o, isActive: !o.isActive } : o
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase className="w-5 h-5" />;
      case 'event': return <Calendar className="w-5 h-5" />;
      case 'internship': return <Users className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'job': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'internship': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Share Opportunities</h2>
            <p className="text-gray-600">Help students by sharing job openings, events, and internship opportunities</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Post Opportunity</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Jobs Posted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {opportunities.filter(o => o.type === 'job').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Events Posted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {opportunities.filter(o => o.type === 'event').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Internships Posted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {opportunities.filter(o => o.type === 'internship').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Posted Opportunities</h3>
        {opportunities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities posted yet</h3>
            <p className="text-gray-600">Start sharing job openings and events with students!</p>
          </div>
        ) : (
          opportunities.map(opportunity => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(opportunity.type)}
                      <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      opportunity.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {opportunity.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {opportunity.company && (
                    <p className="text-gray-600 mb-2">{opportunity.company}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{opportunity.location}</span>
                    </div>
                    {opportunity.salary && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{opportunity.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Posted {opportunity.postedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(opportunity)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(opportunity.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{opportunity.description}</p>

              {opportunity.requirements && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  {Math.floor(Math.random() * 50) + 10} students interested
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleActive(opportunity.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      opportunity.isActive
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {opportunity.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  {opportunity.applicationLink && (
                    <a
                      href={opportunity.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Application
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? 'Edit Opportunity' : 'Post New Opportunity'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'job' | 'event' | 'internship' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="job">Job Opening</option>
                    <option value="event">Event</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                {(formData.type === 'job' || formData.type === 'internship') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Company name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>

                {formData.type === 'event' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {(formData.type === 'job' || formData.type === 'internship') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., $120,000 - $150,000"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter each requirement on a new line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.applicationLink}
                    onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://company.com/apply"
                  />
                </div>
              </form>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Post'} Opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniOpportunities;