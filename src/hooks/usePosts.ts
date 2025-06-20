import { useState, useEffect } from 'react';
import { Post } from '../types';

export const usePosts = (college: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPosts = localStorage.getItem(`alumni-connect-posts-${college}`);
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt)
      }));
      setPosts(parsedPosts);
    }
    setLoading(false);
  }, [college]);

  const addPost = (post: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date(),
      likes: [],
      comments: []
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem(`alumni-connect-posts-${college}`, JSON.stringify(updatedPosts));
  };

  const toggleLike = (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(userId)
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId];
        return { ...post, likes };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem(`alumni-connect-posts-${college}`, JSON.stringify(updatedPosts));
  };

  const addComment = (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem(`alumni-connect-posts-${college}`, JSON.stringify(updatedPosts));
  };

  return { posts, loading, addPost, toggleLike, addComment };
};