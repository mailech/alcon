export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'alumni';
  college: string;
  department: string;
  batch: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  joinedAt: Date;
  // Enhanced profile fields
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  skills?: string[];
  interests?: string[];
  currentPosition?: string;
  company?: string;
  experience?: string;
  achievements?: string[];
  languages?: string[];
  resumeUrl?: string;
  portfolioUrl?: string;
  // Social features
  followers?: string[];
  following?: string[];
  friends?: string[];
  // Privacy settings
  profileVisibility: 'public' | 'college' | 'friends';
  contactVisibility: 'public' | 'college' | 'friends';
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'alumni';
  authorDepartment: string;
  authorBatch: string;
  authorAvatar?: string;
  college: string;
  content: string;
  image?: string;
  attachments?: FileAttachment[];
  tags: string[];
  likes: string[];
  comments: Comment[];
  shares: string[];
  createdAt: Date;
  updatedAt?: Date;
  type: 'general' | 'job' | 'event' | 'academic' | 'announcement';
  isPinned?: boolean;
  visibility: 'public' | 'college' | 'friends';
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'alumni';
  authorAvatar?: string;
  content: string;
  attachments?: FileAttachment[];
  likes: string[];
  replies?: Comment[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'audio';
  url: string;
  size: number;
  uploadedAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  message: string;
  attachments?: FileAttachment[];
  messageType: 'text' | 'image' | 'file' | 'voice' | 'video';
  timestamp: Date;
  read: boolean;
  edited?: boolean;
  editedAt?: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: {
    id: string;
    name: string;
    avatar?: string;
    role: 'student' | 'alumni';
  }[];
  lastMessage?: ChatMessage;
  lastActivity: Date;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdBy?: string;
  createdAt: Date;
  unreadCount: { [userId: string]: number };
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  fromUserRole: 'student' | 'alumni';
  toUserId: string;
  toUserName: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  type: 'friend' | 'follow' | 'mentorship';
  createdAt: Date;
  respondedAt?: Date;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  course?: string;
  createdBy: string;
  members: string[];
  memberDetails: {
    id: string;
    name: string;
    avatar?: string;
    role: 'student' | 'alumni';
  }[];
  isPrivate: boolean;
  maxMembers?: number;
  meetingSchedule?: {
    day: string;
    time: string;
    location: string;
    isOnline: boolean;
  };
  resources: FileAttachment[];
  createdAt: Date;
  lastActivity: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'networking' | 'webinar' | 'social' | 'career' | 'academic';
  date: Date;
  endDate?: Date;
  time: string;
  location: string;
  isOnline: boolean;
  meetingLink?: string;
  organizer: string;
  organizerDetails: {
    name: string;
    avatar?: string;
    role: 'student' | 'alumni';
  };
  attendees: string[];
  maxAttendees?: number;
  rsvpDeadline?: Date;
  tags: string[];
  image?: string;
  attachments?: FileAttachment[];
  requirements?: string[];
  agenda?: string[];
  createdAt: Date;
  updatedAt?: Date;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface JobPost extends Post {
  type: 'job';
  company: string;
  position: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance';
  salary?: string;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];
  applicationLink: string;
  applicationDeadline?: Date;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  remote: boolean;
  skills: string[];
}

export interface EventPost extends Post {
  type: 'event';
  eventTitle: string;
  eventDate: Date;
  location: string;
  description: string;
}

export interface College {
  id: string;
  name: string;
  domain: string;
  departments: string[];
  logo?: string;
  description?: string;
  location?: string;
  website?: string;
  establishedYear?: number;
}

export interface InterviewPrep {
  id: string;
  title: string;
  company: string;
  position: string;
  type: 'technical' | 'behavioral' | 'case-study' | 'group';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: {
    id: string;
    question: string;
    answer?: string;
    tips?: string[];
    category: string;
  }[];
  createdBy: string;
  createdAt: Date;
  rating: number;
  reviews: {
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
}