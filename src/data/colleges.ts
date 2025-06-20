import { College } from '../types';

export const colleges: College[] = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    domain: 'mit.edu',
    departments: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Physics', 'Mathematics', 'Biology', 'Chemistry', 'Economics', 'Management']
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    domain: 'stanford.edu',
    departments: ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law', 'Education', 'Humanities', 'Social Sciences']
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    domain: 'harvard.edu',
    departments: ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law', 'Arts & Sciences', 'Education', 'Public Health']
  },
  {
    id: 'berkeley',
    name: 'UC Berkeley',
    domain: 'berkeley.edu',
    departments: ['EECS', 'Engineering', 'Business', 'Letters & Science', 'Chemistry', 'Physics', 'Mathematics', 'Biology']
  },
  {
    id: 'cmu',
    name: 'Carnegie Mellon University',
    domain: 'cmu.edu',
    departments: ['Computer Science', 'Engineering', 'Business', 'Fine Arts', 'Humanities', 'Public Policy', 'Science']
  }
];

export const postTags = [
  { id: 'jobs', label: 'Jobs', color: 'bg-green-100 text-green-800' },
  { id: 'advice', label: 'Advice', color: 'bg-blue-100 text-blue-800' },
  { id: 'memories', label: 'Memories', color: 'bg-purple-100 text-purple-800' },
  { id: 'networking', label: 'Networking', color: 'bg-orange-100 text-orange-800' },
  { id: 'events', label: 'Events', color: 'bg-pink-100 text-pink-800' },
  { id: 'academics', label: 'Academics', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'internships', label: 'Internships', color: 'bg-teal-100 text-teal-800' },
  { id: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' }
];