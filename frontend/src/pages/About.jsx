import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SparklesIcon, CpuChipIcon, CloudIcon, CommandLineIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export default function About() {
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

        <div className="max-w-4xl text-center relative z-10 space-y-8">
         

          <div className="animate-fade-in-up relative">
          
            
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white mb-6 relative">
          <span className="relative inline-block">
            <CpuChipIcon className="absolute -left-12 -top-3 w-10 h-10 text-blue-400 animate-spin-slow" />
            <div className="relative inline-block">
            <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-shift hover:animate-pulse 
          transition-all duration-300 cursor-default">
            ABOUT SUPER AGENT
            </h1>
            <SparklesIcon 
          className="absolute -right-4 -top-4 w-6 h-6 sm:-right-6 sm:-top-6 sm:w-8 sm:h-8 md:-right-8 md:-top-8 md:w-10 md:h-10 
              bg-clip-text fill-current text-purple-500 animate-pulse z-20"
            />
          </div>
          </span>
            </h2>

            <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg blur opacity-30 transition-opacity duration-300" />
          <div className="relative h-1 w-24 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-6" />
            </div>
          </div>

          <div className="relative cursor-pointer group animate-fade-in-up delay-100">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur opacity-0  transition-opacity duration-300 rounded-xl" />
            <p className="text-xl text-gray-300 leading-relaxed mx-auto max-w-2xl relative bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 group-hover:border-blue-400/30 transition-all duration-300">
          <CloudIcon className="inline-block w-8 h-8 mr-2 -mt-1 text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
            Super Agent
          </span> is an advanced AI-driven assistant designed to enhance productivity, automate tasks, and provide intelligent insights in real-time. 
          <CpuChipIcon className="inline-block w-6 h-6 mx-2 text-purple-400 animate-pulse" />
          Built with cutting-edge technology, it adapts to user needs and ensures seamless interactions across platforms.
            </p>
          </div>

          <div className="animate-fade-in-up delay-200">
            <Link
              to="/features"
              className="group relative inline-flex items-center px-8 py-4 font-semibold text-white overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br from-blue-600/30 to-purple-600/30 hover:from-blue-500 hover:to-purple-500 shadow-md hover:shadow-blue-500/10"
            >
              <span className="relative z-10 flex items-center gap-2">
          Explore Features
          <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Animated circuit pattern with icons */}
        <div className="absolute left-0 right-0 -bottom-20 opacity-20 animate-pulse-slow">
          <div className="flex justify-between px-8">
            {[...Array(5)].map((_, i) => (
              <CommandLineIcon 
                key={i}
                className="w-8 h-8 text-purple-400 animate-spin-slow"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}