import React, { useState } from 'react';
import { User } from '../types';
import { postTags } from '../data/colleges';
import { Image, Type, Briefcase, Calendar, X } from 'lucide-react';

interface CreatePostProps {
  user: User;
  onPost: (content: string, tags: string[], image?: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onPost }) => {
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState('');
  const [postType, setPostType] = useState<'general' | 'job' | 'event'>('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onPost(content, selectedTags, image || undefined);
      setContent('');
      setSelectedTags([]);
      setImage('');
      setPostType('general');
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share with your college community..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />

              {image && (
                <div className="mt-3 relative">
                  <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute top-2 right-2 p-1 bg-gray-900 bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Add tags to your post</h4>
                <div className="flex flex-wrap gap-2">
                  {postTags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedTags.includes(tag.id)
                          ? tag.color
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter image URL:');
                      if (url) setImage(url);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-sm font-medium">Photo</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;