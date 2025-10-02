import { useEffect, useRef, useState } from 'react'
import { connectWS } from './ws.js';
function App() {
  const [userName, setUserName] = useState('')
  const [isNameSet, setIsNameSet] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')

  const socket = useRef();

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (userName.trim()) {
      setIsNameSet(true)
      // emitting the event joinRoom to backend
      socket.current.emit("joinRoom",userName);
    }
  }

  useEffect(()=>{
    socket.current = connectWS();

    socket.current.on("connect",()=>{
      // adding an event listener => roomNotice which is emitted from the backend
      socket.current.on('roomNotice',(userName)=>{
        console.log(`${userName} joined the room`);
      })
    })
  },[]);

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (currentMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: currentMessage,
        sender: userName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setCurrentMessage('')
    }
  }

  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isNameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Welcome to ChatFlow
            </h1>
            <p className="text-gray-400 text-lg font-medium">
              Connect, share, and express yourself
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Enter your name to begin your journey
            </p>
          </div>
          
          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="What should we call you?"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Chatting
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-2xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-t-2xl border border-gray-700 border-b-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ChatFlow
              </h1>
              <p className="text-gray-400 text-sm">Welcome back, {userName}!</p>
            </div>
            <div className="text-gray-400 text-sm">
              {formatTime()}
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 border-l border-r border-gray-700 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Start the conversation</h3>
              <p className="text-gray-400">Send your first message to get things rolling!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-xl border border-gray-600 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-400">{message.sender}</span>
                  <span className="text-gray-400 text-sm">{message.timestamp}</span>
                </div>
                <p className="text-white font-medium leading-relaxed">{message.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-b-2xl border border-gray-700 border-t-0">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-medium"
              rows="2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg self-end"
            >
              Send
            </button>
          </form>
          <p className="text-gray-500 text-xs mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
