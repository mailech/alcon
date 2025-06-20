import React, { useState } from 'react';
import { Post, User } from '../types';
import { postTags } from '../data/colleges';
import { Heart, MessageCircle, Share2, MoreHorizontal, Clock, Building, GraduationCap } from 'lucide-react';

interface PostCardProps {
  post: Post;
  user: User;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, user, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const isLiked = post.likes.includes(user.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {post.authorName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">{post.authorName}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  post.authorRole === 'alumni' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {post.authorRole === 'alumni' ? (
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
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{post.authorDepartment}</span>
                <span>•</span>
                <span>Class of {post.authorBatch}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimeAgo(post.createdAt)}
                </div>
              </div>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-900 leading-relaxed">{post.content}</p>
          {post.image && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-64 object-cover"
              />
            </div>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tagId => {
              const tag = postTags.find(t => t.id === tagId);
              return tag ? (
                <span key={tagId} className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}>
                  #{tag.label}
                </span>
              ) : null;
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes.length}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments.length}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{comment.authorName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          comment.authorRole === 'alumni' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {comment.authorRole}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;