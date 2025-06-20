import React, { useState } from 'react';
import { User } from '../types';
import { Calendar, MapPin, Clock, Users, Plus, ChevronRight } from 'lucide-react';

interface EventsProps {
  user: User;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  type: 'workshop' | 'networking' | 'webinar' | 'social' | 'career';
  isOnline: boolean;
}

const Events: React.FC<EventsProps> = ({ user }) => {
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Alumni Networking Night',
      description: 'Join us for an evening of networking with fellow alumni from various industries. Great opportunity to make new connections and share experiences.',
      date: new Date('2024-02-15'),
      time: '6:00 PM - 9:00 PM',
      location: 'Grand Ballroom, Alumni Center',
      organizer: 'Alumni Association',
      attendees: 45,
      maxAttendees: 100,
      type: 'networking',
      isOnline: false
    },
    {
      id: '2',
      title: 'Tech Career Workshop',
      description: 'Learn about the latest trends in tech careers, resume building, and interview preparation from industry experts.',
      date: new Date('2024-02-20'),
      time: '2:00 PM - 4:00 PM',
      location: 'Virtual Event',
      organizer: 'Career Services',
      attendees: 78,
      maxAttendees: 200,
      type: 'workshop',
      isOnline: true
    },
    {
      id: '3',
      title: 'Startup Pitch Competition',
      description: 'Watch student and alumni teams pitch their innovative startup ideas. Prizes and networking opportunities available.',
      date: new Date('2024-02-25'),
      time: '10:00 AM - 5:00 PM',
      location: 'Innovation Lab, Engineering Building',
      organizer: 'Entrepreneurship Club',
      attendees: 120,
      maxAttendees: 150,
      type: 'career',
      isOnline: false
    },
    {
      id: '4',
      title: 'Coffee Chat with Alumni',
      description: 'Casual coffee meetup for current students to connect with alumni mentors. Come with questions about career paths and industry insights.',
      date: new Date('2024-03-01'),
      time: '11:00 AM - 1:00 PM',
      location: 'Campus Coffee Shop',
      organizer: 'Mentorship Program',
      attendees: 25,
      maxAttendees: 40,
      type: 'social',
      isOnline: false
    }
  ]);

  const [showEventForm, setShowEventForm] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'networking': return 'bg-green-100 text-green-800';
      case 'webinar': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      case 'career': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingEvents = events.filter(event => event.date >= new Date());
  const pastEvents = events.filter(event => event.date < new Date());

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Events</h2>
          <button
            onClick={() => setShowEventForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>
        <p className="text-gray-600">
          Discover and attend events organized by your college community
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    {event.isOnline && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Online
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.attendees} {event.maxAttendees && `/ ${event.maxAttendees}`} attending
                    </span>
                  </div>
                  <span>Organized by {event.organizer}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    Learn More
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Past Events</h3>
          <div className="space-y-3">
            {pastEvents.map(event => (
              <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{formatDate(event.date)} • {event.attendees} attended</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Event</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Alumni Networking Event"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Event description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 6:00 PM - 9:00 PM"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Alumni Center or Virtual Event"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="workshop">Workshop</option>
                      <option value="networking">Networking</option>
                      <option value="webinar">Webinar</option>
                      <option value="social">Social</option>
                      <option value="career">Career</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Attendees
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>
                </div>
              </form>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;