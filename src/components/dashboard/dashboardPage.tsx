import { BiBookOpen, BiCheckCircle, BiMapPin, BiPlus, BiStar } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { FiMessageCircle } from "react-icons/fi";

const mockMatches = [
  {
    id: 1,
    user: { name: "Sarah Chen", avatar: "SC", location: "San Francisco" },
    offering: "React Development",
    wanting: "UI/UX Design",
    match: "UI/UX Design",
    compatibility: 95,
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    user: { name: "Mike Johnson", avatar: "MJ", location: "Remote" },
    offering: "Python Programming",
    wanting: "React Development",
    match: "React Development",
    compatibility: 88,
    lastActive: "1 day ago"
  },
  {
    id: 3,
    user: { name: "Emma Davis", avatar: "ED", location: "New York" },
    offering: "Digital Marketing",
    wanting: "Web Development",
    match: "JavaScript",
    compatibility: 82,
    lastActive: "3 hours ago"
  }
];

export const DashboardPage = () => {
  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:px-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333] font-InterDisplayLight">Active Skills</p>
                <p className="text-2xl  text-gray-900">3</p>
              </div>
              <BiBookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333] font-InterDisplayLight">New Matches</p>
                <p className="text-2xl  text-gray-900">7</p>
              </div>
              <BsPeople className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333] font-InterDisplayLight">Messages</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
              <FiMessageCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333] font-InterDisplayLight">Rating</p>
                <p className="text-2xl  text-gray-900">4.8</p>
              </div>
              <BiStar className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Skill Matches */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg  text-gray-900">Skill Matches</h2>
            <p className="text-sm text-[#333] font-InterDisplayLight">People looking for skills you offer</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockMatches.map((match) => (
              <div key={match.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {match.user.avatar}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{match.user.name}</h3>
                      <p className="text-sm text-[#333] font-InterDisplayLight flex items-center">
                        <BiMapPin size={12} className="mr-1" />
                        {match.user.location}
                      </p>
                      <p className="text-sm text-[#333] font-InterDisplayLight">Active {match.lastActive}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-green-600">{match.compatibility}% match</span>
                    </div>
                    <p className="text-sm text-[#333] font-InterDisplayLight">
                      Wants: <span className="font-medium">{match.wanting}</span>
                    </p>
                    <p className="text-sm text-[#333] font-InterDisplayLight">
                      Offers: <span className="font-medium">{match.offering}</span>
                    </p>
                  </div>
                  
                  <button className="ml-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <BiCheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm text-[#333] font-InterDisplayLight">You completed a React lesson with Sarah Chen</p>
                <span className="text-xs text-[#333] font-InterDisplayLight">2 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <BiPlus className="w-5 h-5 text-blue-500" />
                <p className="text-sm text-gray-700">New skill match found for UI/UX Design</p>
                <span className="text-xs text-gray-500">4 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <FiMessageCircle className="w-5 h-5 text-purple-500" />
                <p className="text-sm text-gray-700">Mike Johnson sent you a message</p>
                <span className="text-xs text-[#333] font-InterDisplayLight">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
