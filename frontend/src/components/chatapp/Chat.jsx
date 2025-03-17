import  { useState, useEffect, useRef } from 'react';
import AnimatedLogo from "../../components/AnimatedLogo";
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  PlusIcon,
  PaperClipIcon,
  ClipboardDocumentIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from '@heroicons/react/24/solid';

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeChatTitle, setActiveChatTitle] = useState('Super AI Agent ');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [feedbackStates, setFeedbackStates] = useState({});
  const [isResponseInProgress, setIsResponseInProgress] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Scroll to bottom 
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);


  useEffect(() => {
    if (activeChat !== null) {
      setChatHistory(prevHistory =>
        prevHistory.map(chat =>
          chat.id === activeChat ? { ...chat, messages: messages } : chat
        )
      );
    }
  }, [messages, activeChat]);

  useEffect(() => {
    if (showCopied) {
      const timer = setTimeout(() => setShowCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCopied]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const startNewChat = () => {
    stopTyping();
    setActiveChat(null);
    setActiveChatTitle('New Chat');
    setMessages([]);
    setInputMessage('');
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newMessage = {
        text: `Uploaded file: ${file.name}`,
        isBot: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (activeChat === null) {
        const newChat = {
          id: Date.now(),
          title: `File: ${file.name.substring(0, 20)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messages: [newMessage],
        };
        setChatHistory([newChat, ...chatHistory]);
        setActiveChat(newChat.id);
        setActiveChatTitle(newChat.title);
        setMessages([newMessage]);
      } else {
        setMessages(prev => [...prev, newMessage]);
      }
    }
  };
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : "";
}; 

    const handleSend = async (e) => {
      e.preventDefault();
      if (!inputMessage.trim() || isResponseInProgress) return;

      const userId = getCookie("user_id");
      const newUserMessage = {
        text: inputMessage,
        isBot: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      if (activeChat === null) {
        const newChat = {
          id: Date.now(),
          title: inputMessage.substring(0, 20) || "New Chat",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          messages: [newUserMessage],
        };
        setChatHistory([newChat, ...chatHistory]);
        setActiveChat(newChat.id);
        setActiveChatTitle(newChat.title);
        setMessages([newUserMessage]);
      } else {
        setMessages((prev) => [...prev, newUserMessage]);
      }

      setInputMessage("");
      setIsResponseInProgress(true);

      try {
         const response = await fetch("/api/chat", {
           method: "POST",
           credentials: "include",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify({
             message: inputMessage,
              
           }),
         });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            text: "",
            fullText: data.response, // Assuming your backend returns the response in a "response" field
            isBot: true,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isTyping: true,
            aborted: false,
          },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle the error appropriately (e.g., display an error message to the user)
      }
    };

  const stopTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setMessages(prev => {
      const updated = [...prev];
      const lastMsg = updated[updated.length - 1];
      if (lastMsg && lastMsg.isBot && lastMsg.isTyping && !lastMsg.aborted) {
        updated[updated.length - 1] = {
          ...lastMsg,
          text: lastMsg.text + "\n[Response Aborted]",
          isTyping: false,
          aborted: true,
        };
      }
      return updated;
    });
    setIsResponseInProgress(false);
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.isTyping && lastMessage.isBot && !lastMessage.aborted) {
      if (typingIntervalRef.current) return;
      let charIndex = 0;
      const fullText = lastMessage.fullText;
      typingIntervalRef.current = setInterval(() => {
        charIndex++;
        setMessages(prev => {
          const updated = [...prev];
          const currentLast = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...currentLast,
            text: fullText.substring(0, charIndex),
            isTyping: charIndex < fullText.length,
          };
          return updated;
        });
        if (charIndex >= fullText.length) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          setIsResponseInProgress(false);
        }
      }, 50);
    }
  }, [messages]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
  };

  const handleThumbs = (chatId, index, type) => {
    setFeedbackStates(prev => ({
      ...prev,
      [`${chatId}-${index}`]: type
    }));
  };

  const ButtonGroup = () => (
    <>
      <button
        onClick={() => {
          setSidebarOpen(!sidebarOpen);
          if (!sidebarOpen && window.innerWidth < 768) {
            startNewChat();
          }
        }}
        className="p-2 hover:bg-gray-700 cursor-pointer rounded-md transition-colors text-gray-400"
      >
        {sidebarOpen ? (
          <ChevronDoubleLeftIcon className="h-5 w-5" />
        ) : (
          <ChevronDoubleRightIcon className="h-5 w-5" />
        )}
      </button>
      <button
        onClick={startNewChat}
        className="p-1.5 hover:bg-gray-700 cursor-pointer rounded-md transition-colors ml-2"
      >
        <PlusIcon className="h-5 w-5 text-gray-400" />
      </button>
    </>
  );

  const updateChatTitle = () => {
    setIsEditingTitle(false);
    if (activeChat !== null) {
      setChatHistory(prevHistory =>
        prevHistory.map(chat =>
          chat.id === activeChat ? { ...chat, title: activeChatTitle } : chat
        )
      );
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      updateChatTitle();
    }
  };

  const lastMsg = messages[messages.length - 1];
  const showStop = lastMsg && lastMsg.isBot && lastMsg.isTyping;

return (
  <div className="h-[calc(100vh-60px)] flex flex-col bg-gray-900 overflow-hidden">
    {showCopied && (
      <div className="fixed mt-20 z-50 top-4 left-1/2 transform -translate-x-1/2 bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm animate-slide-down">
        Copied to clipboard!
      </div>
    )}

    <div className="flex flex-1 overflow-hidden relative">
      <div className={`bg-gray-800 h-full transform transition-all duration-300 ease-in-out
        ${sidebarOpen 
          ? 'w-64 translate-x-0 border-r border-gray-700' 
          : 'w-0 -translate-x-full md:translate-x-0 md:border-r-0'
        }
        absolute md:relative z-30`}>
        <div className={`${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <div className="p-4 border-b cursor-pointer border-gray-700 h-16 flex items-center justify-end">
            {sidebarOpen ? (
              <>
                <h2 className="text-sm font-semibold mr-2 text-gray-300">Chat History</h2>
                <ButtonGroup />
              </>
            ) : (
              <button className="p-1.5 hover:bg-gray-700 rounded-md transition-colors">
                <span onClick={() => setSidebarOpen(true)} className="inline-block">
                  <ChevronDoubleRightIcon className="h-5 w-5 text-gray-400" />
                </span>
              </button>
            )}
          </div>
          <div className="overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
            {chatHistory.map(chat => (
              <div
                key={chat.id}
                onClick={() => {
                  if (isResponseInProgress) stopTyping();
                  setActiveChat(chat.id);
                  setActiveChatTitle(chat.title);
                  setMessages(chat.messages || []);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`p-3 mx-2 my-1 rounded-md text-sm cursor-pointer transition-transform transform hover:scale-101
                  ${activeChat === chat.id 
                    ? 'bg-blue-900 border border-blue-700' 
                    : 'hover:bg-gray-700'
                  }`}
              >
                <p className="font-medium text-left text-gray-300 truncate">
                  {chat.title}
                </p>
                {sidebarOpen && (
                  <p className="text-xs text-right text-gray-500 mt-1">{chat.timestamp}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <div className="w-full h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-center relative shadow-sm">
          {!sidebarOpen && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <ButtonGroup />
            </div>
          )}
          {isEditingTitle ? (
            <input
              type="text"
              value={activeChatTitle}
              onChange={(e) => setActiveChatTitle(e.target.value)}
              onBlur={updateChatTitle}
              onKeyDown={handleTitleKeyDown}
              className="text-sm font-semibold text-gray-300 bg-gray-800 border-b border-gray-700 focus:outline-none text-center"
              autoFocus
            />
          ) : (
            <h1
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-sm font-semibold text-gray-300 cursor-pointer"
            >
              {activeChatTitle}
            </h1>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-900 custom-scrollbar">
          <div className="max-w-3xl mx-auto w-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] transition-opacity duration-500">
                <div className="text-center w-80 mb-0 text-gray-400">
                  <div className="relative mb-10 h-16 flex items-center justify-center">
                    <AnimatedLogo className="h-full" />
                  </div>
                  <p className="text-3xl leading-tight mt-2">Hi, I'm Super Ai Agent.</p>
                  <p className="text-xl leading-tight mt-1">How can I help you today?</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex transition-all duration-300 ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                      message.isBot
                        ? 'bg-gray-700/10 text-gray-300'
                        : 'bg-gray-600/20 text-white'
                    }`}
                  >
                    <div className="text-gray-300 max-w-3xl mx-auto text-left break-words">
                      {message.text}
                      {message.isTyping && (
                        <span className="ml-1 animate-pulse">█</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      {message.isBot && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCopy(message.text)}
                            className="text-gray-400 hover:text-gray-200 transition-colors"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleThumbs(activeChat, index, 'like')}
                            className={`transition-colors ${
                              feedbackStates[`${activeChat}-${index}`] === 'like' 
                                ? 'text-blue-400' 
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                          >
                            <HandThumbUpIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleThumbs(activeChat, index, 'dislike')}
                            className={`transition-colors ${
                              feedbackStates[`${activeChat}-${index}`] === 'dislike' 
                                ? 'text-red-400' 
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                          >
                            <HandThumbDownIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <p className={`text-xs ${message.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSend} className="p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 items-center bg-gray-700/20 rounded-lg px-3 py-2">
              <label className="cursor-pointer p-1 hover:bg-gray-600/20 rounded transition-colors text-gray-400">
                <PaperClipIcon className="h-5 w-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message SuperAgent"
                className="flex-1 p-1 bg-transparent focus:outline-none text-gray-300 placeholder-gray-500 transition-colors w-full"
              />
              {showStop ? (
                <button
                  type="button"
                  onClick={stopTyping}
                  className="px-4 py-2 bg-red-600 text-white rounded-md transition-colors text-sm"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Send
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
);
};

export default Chat;
