import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { MessageCircle, Users, Star, Calendar, Briefcase, Send, Search, Filter, Clock, CheckCircle } from 'lucide-react';

interface MentorshipProps {
  user: User;
}

interface MentorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentDepartment: string;
  studentBatch: string;
  alumniId: string;
  alumniName: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}

interface AlumniProfile {
  id: string;
  name: string;
  department: string;
  batch: string;
  currentRole?: string;
  company?: string;
  expertise: string[];
  bio: string;
  rating: number;
  totalMentorships: number;
  isAvailable: boolean;
}

const Mentorship: React.FC<MentorshipProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'find-mentors' | 'my-requests' | 'chat' | 'mentor-dashboard'>('find-mentors');
  const [mentors, setMentors] = useState<AlumniProfile[]>([]);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('all');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({ subject: '', message: '' });
  const [chatMessage, setChatMessage] = useState('');

  // Mock data for alumni mentors
  useEffect(() => {
    const mockMentors: AlumniProfile[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        department: 'Computer Science',
        batch: '2018',
        currentRole: 'Senior Software Engineer',
        company: 'Google',
        expertise: ['Software Development', 'Career Guidance', 'Interview Prep'],
        bio: 'Passionate about helping students transition into tech careers. 5+ years at Google working on distributed systems.',
        rating: 4.9,
        totalMentorships: 25,
        isAvailable: true
      },
      {
        id: '2',
        name: 'Michael Chen',
        department: 'Business',
        batch: '2016',
        currentRole: 'Product Manager',
        company: 'Microsoft',
        expertise: ['Product Management', 'Entrepreneurship', 'Leadership'],
        bio: 'Former startup founder, now PM at Microsoft. Love helping students understand product strategy and business development.',
        rating: 4.8,
        totalMentorships: 18,
        isAvailable: true
      },
      {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        department: 'Engineering',
        batch: '2015',
        currentRole: 'Research Scientist',
        company: 'Tesla',
        expertise: ['Research', 'PhD Guidance', 'Technical Writing'],
        bio: 'PhD in Electrical Engineering, now working on autonomous vehicle technology. Happy to guide students in research and academia.',
        rating: 4.7,
        totalMentorships: 12,
        isAvailable: false
      }
    ];
    setMentors(mockMentors);
  }, []);

  const handleSendRequest = (mentorId: string) => {
    if (!requestForm.subject.trim() || !requestForm.message.trim()) return;

    const mentor = mentors.find(m => m.id === mentorId);
    if (!mentor) return;

    const newRequest: MentorshipRequest = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: user.name,
      studentDepartment: user.department,
      studentBatch: user.batch,
      alumniId: mentorId,
      alumniName: mentor.name,
      subject: requestForm.subject,
      message: requestForm.message,
      status: 'pending',
      createdAt: new Date()
    };

    setRequests([...requests, newRequest]);
    setRequestForm({ subject: '', message: '' });
    setShowRequestForm(false);
    setSelectedMentor(null);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedChat) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      receiverId: selectedChat,
      message: chatMessage,
      timestamp: new Date()
    };

    setChats([...chats, newMessage]);
    setChatMessage('');
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = searchQuery === '' || 
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesExpertise = expertiseFilter === 'all' || 
      mentor.expertise.some(exp => exp.toLowerCase().includes(expertiseFilter.toLowerCase()));
    
    return matchesSearch && matchesExpertise;
  });

  const allExpertise = [...new Set(mentors.flatMap(m => m.expertise))];

  if (user.role === 'student') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alumni Mentorship</h2>
          <p className="text-gray-600 mb-6">
            Connect with experienced alumni for career guidance, academic advice, and professional development.
          </p>
          
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('find-mentors')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'find-mentors'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Find Mentors
            </button>
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'my-requests'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Requests
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Messages
            </button>
          </div>
        </div>

        {activeTab === 'find-mentors' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search mentors by name, company, or expertise..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={expertiseFilter}
                  onChange={(e) => setExpertiseFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Expertise</option>
                  {allExpertise.map(exp => (
                    <option key={exp} value={exp.toLowerCase()}>{exp}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map(mentor => (
                <div key={mentor.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-purple-600">
                        {mentor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-600">{mentor.currentRole} at {mentor.company}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><span className="font-medium">Department:</span> {mentor.department}</p>
                    <p><span className="font-medium">Batch:</span> {mentor.batch}</p>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{mentor.rating} ({mentor.totalMentorships} mentorships)</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-2">{mentor.bio}</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map(exp => (
                        <span key={exp} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setShowRequestForm(true);
                      }}
                      disabled={!mentor.isAvailable}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                        mentor.isAvailable
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {mentor.isAvailable ? 'Request Mentorship' : 'Unavailable'}
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-requests' && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No mentorship requests yet</h3>
                <p className="text-gray-600">Start by finding mentors and sending your first request!</p>
              </div>
            ) : (
              requests.map(request => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.subject}</h3>
                      <p className="text-sm text-gray-600">To: {request.alumniName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{request.message}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Sent {request.createdAt.toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-sm border h-96">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Messages</h3>
            </div>
            <div className="flex-1 p-4 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No active conversations yet</p>
              <p className="text-sm">Start a mentorship to begin chatting with alumni</p>
            </div>
          </div>
        )}

        {showRequestForm && selectedMentor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Request Mentorship from {selectedMentor.name}
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={requestForm.subject}
                      onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Career guidance for software engineering"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={requestForm.message}
                      onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Introduce yourself and explain what kind of guidance you're looking for..."
                    />
                  </div>
                </form>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowRequestForm(false);
                      setSelectedMentor(null);
                      setRequestForm({ subject: '', message: '' });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendRequest(selectedMentor.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Alumni view
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mentor Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Help guide the next generation of students from your college. Share your experience and make a difference.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Mentorships</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Mentorship Requests</h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">Career guidance for software engineering</h4>
                <p className="text-sm text-gray-600">From: Alex Thompson (Computer Science, Class of 2025)</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Pending
              </span>
            </div>
            <p className="text-gray-700 mb-4">
              Hi! I'm a junior studying CS and really interested in following a similar path to yours at Google. 
              Would love to get some advice on interview preparation and what skills to focus on.
            </p>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Accept
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;