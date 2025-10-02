import { useState } from "react";
import { BiSend } from "react-icons/bi";

const mockMessages = [
  {
    id: 1,
    user: { name: "Sarah Chen", avatar: "SC" },
    lastMessage: "Thanks for the React lesson! When can we schedule the next one?",
    time: "2 min ago",
    unread: true,
    online: true
  },
  {
    id: 2,
    user: { name: "Mike Johnson", avatar: "MJ" },
    lastMessage: "I have some Python questions about async programming",
    time: "1 hour ago",
    unread: true,
    online: false
  },
  {
    id: 3,
    user: { name: "Emma Davis", avatar: "ED" },
    lastMessage: "The marketing strategy document looks great!",
    time: "3 hours ago",
    unread: false,
    online: true
  }
];

export const MessagesPage = () => {
  const [selectedMessage, setSelectedMessage] = useState(mockMessages[0]);

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:px-6 h-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex">
          {/* Messages List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            
            <div className="overflow-y-auto">
              {mockMessages.map((message) => (
                <div 
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedMessage.id === message.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {message.user.avatar}
                      </div>
                      {message.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-gray-900 truncate">{message.user.name}</p>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                    </div>
                    
                    {message.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {selectedMessage.user.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedMessage.user.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedMessage.online ? 'Online' : `Last seen ${selectedMessage.time}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-gray-900 text-white rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm">Hi! I&apos;d love to learn more about your React development skills.</p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm">{selectedMessage.lastMessage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <BiSend size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};