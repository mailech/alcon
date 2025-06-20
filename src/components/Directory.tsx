import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Search, Filter, GraduationCap, Building, Mail, MessageCircle, Users, UserPlus, Phone, MapPin } from 'lucide-react';

interface DirectoryProps {
  user: User;
  onStartConversation: (userId: string) => void;
}

const Directory: React.FC<DirectoryProps> = ({ user, onStartConversation }) => {
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'alumni'>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    const savedUsers = localStorage.getItem('alumni-connect-users');
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers);
      const collegeUsers = allUsers.filter((u: User) => u.college === user.college && u.id !== user.id);
      setUsers(collegeUsers);
      setFilteredUsers(collegeUsers);
    }
  }, [user.college, user.id]);

  useEffect(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.batch.includes(searchQuery) ||
        (u.currentPosition && u.currentPosition.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.company && u.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(u => u.department === departmentFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter, departmentFilter]);

  const departments = [...new Set(users.map(u => u.department))];

  const handleSendConnectionRequest = (targetUser: User) => {
    // Add notification for the target user
    addNotification({
      type: 'request',
      title: 'New Connection Request',
      message: `${user.name} wants to connect with you`,
      fromUser: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      },
      read: false
    });

    // Show success message (in a real app, this would be handled by the backend)
    alert(`Connection request sent to ${targetUser.name}!`);
  };

  return (
    <div className="space-y-6">
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 transition-colors`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          Alumni Directory
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search by name, department, position, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              />
            </div>
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'student' | 'alumni')}
            className={`px-4 py-2 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="alumni">Alumni</option>
          </select>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className={`px-4 py-2 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(person => (
          <div key={person.id} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 hover:shadow-md transition-all`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                {person.avatar ? (
                  <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-medium text-white">
                    {person.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {person.name}
                </h3>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    person.role === 'alumni' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {person.role === 'alumni' ? (
                      <>
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Alumni
                      </>
                    ) : (
                      <>
                        <Building className="w-3 h-3 mr-1" />
                        Student
                      </>
                    )}
                  </span>
                </div>
                {person.currentPosition && (
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {person.currentPosition}
                    {person.company && ` at ${person.company}`}
                  </p>
                )}
              </div>
            </div>
            
            <div className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              <p><span className="font-medium">Department:</span> {person.department}</p>
              <p><span className="font-medium">Batch:</span> {person.batch}</p>
              {person.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{person.location}</span>
                </div>
              )}
              {person.bio && (
                <p className="mt-2"><span className="font-medium">Bio:</span> {person.bio}</p>
              )}
            </div>

            {/* Skills */}
            {person.skills && person.skills.length > 0 && (
              <div className="mb-4">
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Skills:
                </p>
                <div className="flex flex-wrap gap-1">
                  {person.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                  {person.skills.length > 3 && (
                    <span className={`px-2 py-1 ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full text-xs`}>
                      +{person.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => onStartConversation(person.id)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Message</span>
              </button>
              <button
                onClick={() => handleSendConnectionRequest(person)}
                className={`flex items-center justify-center px-3 py-2 border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-lg transition-colors`}
              >
                <UserPlus className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
              {person.phone && (
                <button className={`flex items-center justify-center px-3 py-2 border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  <Phone className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            No users found
          </h3>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default Directory;