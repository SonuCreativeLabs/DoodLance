import { useState } from 'react';
import { ChevronDown, ChevronUp, User, Star, MessageCircle, Phone } from 'lucide-react';

interface ClientProfileData {
  name?: string;
  image?: string;
  location?: string;
  memberSince?: string | Date;
  rating?: number;
  moneySpent?: number;
  jobsCompleted?: number;
  freelancersWorked?: number;
  freelancerAvatars?: string[];
  experienceLevel?: string;
}

interface ClientProfileProps {
  client: ClientProfileData | null;
  location?: string;
  showCommunicationButtons?: boolean;
  onChat?: () => void;
  onCall?: () => void;
  defaultExpanded?: boolean;
  chatDisabled?: boolean;
}

// Category mapping for display
const getExperienceLevelDisplayName = (level: string) => {
  const levelMap: Record<string, string> = {
    'Beginner': 'Beginner',
    'Intermediate': 'Intermediate',
    'Expert': 'Expert',
    'Professional': 'Professional'
  };
  return levelMap[level] || level;
};

export function ClientProfile({
  client,
  location,
  showCommunicationButtons = false,
  onChat,
  onCall,
  defaultExpanded = false,
  chatDisabled = false
}: ClientProfileProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-tr from-black via-gray-900 to-black border border-gray-800/50 shadow-xl">
      {/* Background decoration - layered gradients */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-purple-600/6 via-purple-500/4 to-purple-400/2 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-700/5 to-purple-600/3 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-gray-800/8 to-black/6 rounded-full blur-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-900/3 to-transparent"></div>

      {/* Card content */}
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white/90">Client Profile</h2>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isExpanded ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                {client?.image ? (
                  <img
                    src={client.image}
                    alt={client.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-purple-400" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">{client?.name || 'Unknown Client'}</h3>
                <p className="text-sm text-gray-400">{location || client?.location || 'Location not specified'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-400 mb-1">Experience Level</h4>
                  <p className="text-sm text-white">
                    {getExperienceLevelDisplayName(client?.experienceLevel || 'Expert')}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-400 mb-1">Member Since</h4>
                  <p className="text-sm text-white">
                    {client?.memberSince ?
                      new Date(client.memberSince).getFullYear() :
                      '2023'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-600/30">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {client?.freelancerAvatars?.length ? (
                          client.freelancerAvatars.map((avatar, i) => (
                            <img
                              key={i}
                              src={avatar}
                              alt={`Freelancer ${i + 1}`}
                              className="w-7 h-7 rounded-full border-2 border-[#111111] object-cover"
                            />
                          ))
                        ) : (
                          Array.from({ length: Math.min(3, client?.freelancersWorked || 1) }).map((_, i) => (
                            <div key={i} className="w-7 h-7 rounded-full bg-purple-500/20 border-2 border-[#111111] flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-purple-300" />
                            </div>
                          ))
                        )}
                        {client?.freelancersWorked && client.freelancersWorked > 3 && (
                          <div className="w-7 h-7 rounded-full bg-purple-500/20 border-2 border-[#111111] flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-300">
                              +{client.freelancersWorked - 3}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-300 font-medium">
                          {client?.freelancersWorked || 1} Freelancers
                        </p>
                        <p className="text-xs text-gray-500">Worked with this client</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < Math.floor(client?.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-white">
                          {client?.rating?.toFixed(1) || '5.0'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Client Rating</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-600/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-medium text-gray-400 mb-1">Money Spent</h4>
                    <p className="text-sm font-medium text-white">
                      ₹{(client?.moneySpent || 0).toLocaleString('en-IN')}+
                    </p>
                    <p className="text-xs text-gray-500">On DoodLance</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-medium text-gray-400 mb-1">Bookings</h4>
                    <p className="text-sm font-medium text-white">
                      {client?.jobsCompleted || 0}
                    </p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {showCommunicationButtons && (
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={onChat}
                  disabled={chatDisabled}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${chatDisabled
                      ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/90 hover:text-white'
                    }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </button>
                <button
                  onClick={onCall}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                {client?.image ? (
                  <img
                    src={client.image}
                    alt={client.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-purple-400" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">{client?.name || 'Unknown Client'}</h3>
                <p className="text-sm text-gray-400">{location || client?.location || 'Location not specified'}</p>
              </div>
            </div>

            {showCommunicationButtons && (
              <div className="flex space-x-2">
                <button
                  onClick={onChat}
                  disabled={chatDisabled}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${chatDisabled
                    ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/90 hover:text-white'
                    }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </button>
                <button
                  onClick={onCall}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
