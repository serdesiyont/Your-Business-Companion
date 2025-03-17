import React from "react";
import { 
  SparklesIcon,
  UserIcon,
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  PaperAirplaneIcon,
  CommandLineIcon
} from "@heroicons/react/24/solid";

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-6 overflow-hidden">
      {/* Animated background icons */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-24 h-24 text-blue-400/10 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`
            }}
          >
            <CommandLineIcon className="w-full h-full" />
          </div>
        ))}
      </div>

      <div className="max-w-2xl w-full relative z-10 space-y-8">
        {/* Header Section */}
        <div className="text-center animate-fade-in-up relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Get In Touch
          </h2>
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-30" />
            <div className="relative h-1 w-32 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-gradient-shift" />
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md mx-auto">
            Have questions or need assistance? Our team is ready to help you 24/7
          </p>
        </div>

        {/* Contact Form */}
        <div className="group relative bg-gray-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-shift opacity-0  transition-opacity duration-300" />
          
          <form className="space-y-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-gray-400 pl-1 flex items-center gap-2">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 pl-10 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all duration-300"
                    placeholder=""
                  />
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400/50" />
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-gray-400 pl-1 flex items-center gap-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full px-4 py-3 pl-11 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300"
                    placeholder=""
                  />
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50" />
                </div>
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-gray-400 pl-1 flex items-center gap-2">
                Message
              </label>
              <div className="relative">
                <textarea
                  className="w-full px-4 py-3 pl-11 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-500/50 focus:border-pink-500/30 transition-all duration-300 resize-none"
                  rows="4"
                  placeholder="How can we help you?"
                />
                <ChatBubbleBottomCenterTextIcon className="absolute left-3 top-4 w-5 h-5 text-pink-400/50" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full group relative px-6 py-3 font-semibold text-white overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-100 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-sm sm:text-base">Send Message</span>
                <PaperAirplaneIcon className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 animate-bounce-horizontal" />
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent w-1/2 -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-300" />
            </button>
          </form>
        </div>

        {/* Floating icons */}
        <div className="absolute -bottom-20 left-0 right-0 flex justify-center space-x-6 opacity-20 animate-float">
          {[...Array(3)].map((_, i) => (
            <PaperAirplaneIcon 
              key={i}
              className="w-8 h-8 text-blue-400"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contact;
