import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { usePosts } from './hooks/usePosts';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import CreatePost from './components/CreatePost';
import Directory from './components/Directory';
import JobBoard from './components/JobBoard';
import Events from './components/Events';
import Mentorship from './components/Mentorship';
import AlumniOpportunities from './components/AlumniOpportunities';
import ProfilePage from './components/ProfilePage';
import ChatInterface from './components/ChatInterface';
import { colleges } from './data/colleges';
import { Comment, Conversation, ChatMessage } from './types';

function AppContent() {
  const { user, login, logout, updateUser, loading } = useAuth();
  const { posts, addPost, toggleLike, addComment } = usePosts(user?.college || '');
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={login} />;
  }

  const handleCreatePost = (content: string, tags: string[], image?: string) => {
    addPost({
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorDepartment: user.department,
      authorBatch: user.batch,
      authorAvatar: user.avatar,
      college: user.college,
      content,
      image,
      tags,
      type: 'general',
      shares: [],
      visibility: 'college',
      isPinned: false
    });
  };

  const handleLike = (postId: string) => {
    toggleLike(postId, user.id);
  };

  const handleComment = (postId: string, content: string) => {
    const comment: Omit<Comment, 'id' | 'createdAt'> = {
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      content,
      likes: [],
      replies: []
    };
    addComment(postId, comment);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => post.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleStartConversation = (userId: string) => {
    // Check if conversation already exists
    const existingConv = conversations.find(conv => 
      conv.participants.includes(userId) && conv.participants.includes(user.id)
    );
    
    if (existingConv) {
      setActiveConversation(existingConv.id);
    } else {
      // Create new conversation
      const newConv: Conversation = {
        id: Date.now().toString(),
        participants: [user.id, userId],
        participantDetails: [
          {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            role: user.role
          },
          // This would normally be fetched from user data
          {
            id: userId,
            name: 'Other User',
            role: 'student'
          }
        ],
        lastActivity: new Date(),
        isGroup: false,
        createdAt: new Date(),
        unreadCount: { [user.id]: 0, [userId]: 0 }
      };
      
      setConversations(prev => [newConv, ...prev]);
      setActiveConversation(newConv.id);
    }
    setShowChat(true);
  };

  const handleSendMessage = (conversationId: string, message: string) => {
    // This would normally send the message to a backend
    console.log('Sending message:', { conversationId, message });
  };

  const college = colleges.find(c => c.id === user.college);

  const renderMainContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to {college?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with {user.role === 'student' ? 'fellow students and alumni' : 'current students and fellow alumni'} from your college community
              </p>
            </div>
            
            <CreatePost user={user} onPost={handleCreatePost} />
            
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={user}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {searchQuery || selectedTags.length > 0 
                      ? 'Try adjusting your search or filters'
                      : 'Be the first to share something with your college community!'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'directory':
        return <Directory user={user} onStartConversation={handleStartConversation} />;
      
      case 'mentorship':
        return <Mentorship user={user} />;
      
      case 'opportunities':
        return user.role === 'alumni' ? <AlumniOpportunities user={user} /> : <JobBoard user={user} />;
      
      case 'jobs':
        return <JobBoard user={user} />;
      
      case 'events':
        return <Events user={user} />;
      
      case 'trending':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Trending Topics</h2>
            <p className="text-gray-600 dark:text-gray-300">Feature coming soon...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header 
        user={user} 
        onLogout={logout} 
        onSearch={setSearchQuery}
        onOpenProfile={() => setShowProfile(true)}
        onOpenChat={() => setShowChat(true)}
      />
      
      <div className="flex">
        <Sidebar 
          user={user} 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {showProfile && (
        <ProfilePage
          user={user}
          onUpdateUser={updateUser}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showChat && (
        <ChatInterface
          user={user}
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={setActiveConversation}
          onSendMessage={handleSendMessage}
          onStartConversation={handleStartConversation}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <NotificationProvider user={null}>
          <AppContent />
        </NotificationProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;