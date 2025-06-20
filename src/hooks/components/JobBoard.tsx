import React, { useState } from 'react';
import { User } from '../types';
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink, Plus } from 'lucide-react';

interface JobBoardProps {
  user: User;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  salary?: string;
  description: string;
  requirements: string[];
  postedBy: string;
  postedAt: Date;
  applicationLink: string;
}

const JobBoard: React.FC<JobBoardProps> = ({ user }) => {
  const [jobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: '$120,000 - $150,000',
      description: 'We are looking for a passionate Software Engineer to join our team and help build the next generation of our platform.',
      requirements: ['Bachelor\'s in Computer Science', '3+ years experience', 'React/Node.js'],
      postedBy: 'John Doe (Alumni)',
      postedAt: new Date('2024-01-15'),
      applicationLink: 'https://techcorp.com/careers'
    },
    {
      id: '2',
      title: 'Data Science Intern',
      company: 'Analytics Inc',
      location: 'Remote',
      type: 'internship',
      description: 'Summer internship opportunity to work on machine learning projects and data analysis.',
      requirements: ['Currently pursuing degree', 'Python/R experience', 'Statistics background'],
      postedBy: 'Jane Smith (Alumni)',
      postedAt: new Date('2024-01-12'),
      applicationLink: 'https://analytics.com/internships'
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'New York, NY',
      type: 'full-time',
      salary: '$140,000 - $180,000',
      description: 'Lead product strategy and development for our growing SaaS platform.',
      requirements: ['MBA or equivalent', '5+ years PM experience', 'Tech industry background'],
      postedBy: 'Mike Johnson (Alumni)',
      postedAt: new Date('2024-01-10'),
      applicationLink: 'https://startupxyz.com/jobs'
    }
  ]);

  const [showJobForm, setShowJobForm] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'internship': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Job Board</h2>
          {user.role === 'alumni' && (
            <button
              onClick={() => setShowJobForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Post Job</span>
            </button>
          )}
        </div>
        <p className="text-gray-600">
          Discover job opportunities and internships shared by alumni from your college
        </p>
      </div>

      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Posted {formatDate(job.postedAt)} by {job.postedBy}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{job.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                {Math.floor(Math.random() * 50) + 10} applicants
              </div>
              <a
                href={job.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Apply Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Post a Job</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., $120,000 - $150,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Job description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Link
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://company.com/apply"
                  />
                </div>
              </form>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowJobForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowJobForm(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Post Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;