import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Heart, Share2, MessageCircle } from 'lucide-react';
import Image from 'next/image';

type Post = {
  id: number;
  user: {
    name: string;
    avatar: string;
    level: number;
    timeAgo: string;
  };
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    duration?: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  isCoachTip?: boolean;
  isAchievement?: boolean;
  tags?: string[];
};

const Community = () => {
  const [activeTab, setActiveTab] = useState<'trending' | 'following' | 'featured'>('trending');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/80?img=1',
        level: 5,
        timeAgo: '2h ago'
      },
      content: 'Just nailed my first TEDx audition! 🎉 The VR practice sessions really helped me overcome my stage fright. Thank you @PitchToMe community for all the support!',
      likes: 47,
      comments: 12,
      isLiked: false,
      isAchievement: true,
      tags: ['#Success', '#TEDx', '#VRTraining']
    },
    {
      id: 2,
      user: {
        name: 'Marcus Johnson',
        avatar: 'https://i.pravatar.cc/80?img=2',
        level: 3,
        timeAgo: '5h ago'
      },
      content: 'Working on my elevator pitch. Any feedback on my body language? 🤔',
      media: {
        type: 'image',
        url: 'https://images.pexels.com/photos/3771088/pexels-photo-3771088.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2',
      },
      likes: 23,
      comments: 8,
      isLiked: false,
      tags: ['#Feedback', '#BodyLanguage', '#Practice']
    },
    {
      id: 3,
      user: {
        name: 'Mawa SIMBA',
        avatar: 'https://i.pravatar.cc/80?img=3',
        level: 10,
        timeAgo: '1d ago'
      },
      content: '💡 Pro Tip: The 3-second rule - pause for 3 seconds before answering difficult questions. It shows confidence and gives you time to think.',
      likes: 156,
      comments: 34,
      isLiked: true,
      isCoachTip: true,
      tags: ['#ProTip', '#Confidence', '#QA']
    }
  ]);

  const toggleLike = (postId: number) => {
    setPosts((prevPosts: Post[]) => 
      prevPosts.map((post: Post) => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Community</h2>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white p-2">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white p-2">
            <Users className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-800">
        <div className="flex space-x-6">
          {[
            { id: 'trending', label: 'Trending' },
            { id: 'following', label: 'Following' },
            { id: 'featured', label: 'Featured' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 border-b-2 ${activeTab === tab.id 
                ? 'border-purple-500 text-white' 
                : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="px-6 py-4 overflow-x-auto">
        <div className="flex space-x-3">
          {['#PublicSpeaking', '#BodyLanguage', '#VRTraining', '#TEDxTips'].map((tag, i) => (
            <div 
              key={tag} 
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                i === 0 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' 
                  : 'bg-gray-700/50 text-white'
              }`}
            >
              {i === 0 && '🔥 '}{tag}
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        {posts.map(post => (
          <div 
            key={post.id}
            className={`rounded-xl overflow-hidden border ${
              post.isCoachTip 
                ? 'bg-gradient-to-r from-purple-900 to-purple-700 border-purple-600' 
                : 'bg-gray-700/50 border-gray-600'
            }`}
          >
            {/* Post Header */}
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img 
                    src={post.user.avatar} 
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  {post.isCoachTip && (
                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                      COACH
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-white">{post.user.name}</h4>
                    {!post.isCoachTip && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                        Level {post.user.level}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs">{post.user.timeAgo}</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                  </svg>
                </button>
              </div>

              {/* Post Content */}
              <p className="mt-3 text-white">
                {post.content}
                {post.tags && post.tags.length > 0 && (
                  <span className="block mt-1">
                    {post.tags?.map((tag: string) => (
                      <span key={tag} className="text-cyan-400 mr-2">{tag}</span>
                    ))}
                  </span>
                )}
              </p>

              {/* Achievement Badge */}
              {post.isAchievement && (
                <div className="mt-3 bg-gray-900 bg-opacity-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span className="text-white text-sm font-medium">Achievement Unlocked!</span>
                  </div>
                  <p className="text-gray-300 text-xs mt-1">TEDx Speaker Candidate - First audition completed</p>
                </div>
              )}

              {/* Media */}
              {post.media && (
                <div className="mt-3 relative rounded-lg overflow-hidden">
                  <img 
                    src={post.media.url} 
                    alt="Post media"
                    className="w-full h-48 object-cover"
                  />
                  {post.media.type === 'video' && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <button className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 5v10l8-5-8-5z"/>
                        </svg>
                      </button>
                      {post.media.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {post.media.duration}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="text-gray-400 hover:text-green-400">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Community;
