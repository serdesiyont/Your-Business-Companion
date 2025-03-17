import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SparklesIcon} from "@heroicons/react/24/solid";
import { ArrowRightIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import agentrobo from "../assets/Logo/agentrobo.png";
import superai from "../assets/Logo/SuperAgentLogo.svg"
import AnimatedLogo from "../components/AnimatedLogo";

function Home() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const wordsWithStyles = [
    { text: "veryfaster", color: "text-blue-400" },
    { text: "smarter", color: "text-purple-400" },
    { text: "stronger", color: "text-pink-400" },
    { text: "better", color: "text-indigo-400" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % wordsWithStyles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 space-y-6 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse-slow" />
      <div className="absolute mb-0 inset-0 bg-black/80 backdrop-blur-sm z-0" />

      <div className=" z-10 space-y-4 text-center">

      <div className="flex items-center justify-center m-0 p-0">
        <div className="-mt-20">
          <AnimatedLogo />
        </div>
      </div>


        <div className="group -mt-5 relative max-w-2xl mx-auto">
          <div className="absolute -inset-1 " />
          <p className="relative text-lg sm:text-xl text-gray-300 px-6 py-4 rounded-xl transition-all 
                 duration-300">
            Your AI-powered assistant for {" "}
            <span className={`${wordsWithStyles[currentWordIndex].color} font-semibold inline-block animate-fade-in-out`}>
              {wordsWithStyles[currentWordIndex].text}
            </span>{" "}
            solutions.
          </p>
        </div>

        

        <img 
          src={agentrobo} 
          className="absolute w-36 sm:w-48 md:w-56 opacity-50 hover:opacity-80 transition-all duration-300 
                 mix-blend-lighten animate-float-3d" 
          style={{ 
            top: `${cursorPosition.y * 0.18}px`, 
            left: `${cursorPosition.x * 0.18}px`,
            transform: `translate3d(${cursorPosition.x * 0.02}px, ${cursorPosition.y * 0.02}px, 0) 
                       rotate(${cursorPosition.x * 0.02}deg)`
          }}
          onError={(e) => { e.target.style.display = 'none' }} 
        />

         {/* CTA */}
          <div className="relative mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/features"
              className="group relative inline-flex items-center px-8 py-4 font-semibold text-white overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br from-blue-600/30 to-purple-600/30 hover:from-blue-500 hover:to-purple-500 shadow-md hover:shadow-blue-500/10"
            >
              <span className="relative z-10 flex items-center gap-3">
                <ArrowRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                <span className="bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
                  Explore Features
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <Link
              to="/login"
              className="group relative inline-flex items-center px-8 py-4 font-semibold text-white overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 hover:from-purple-500 hover:to-pink-500 shadow-md hover:shadow-purple-500/10"
            >
              <span className="relative z-10 flex items-center gap-3">
                <UserPlusIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
                <span className="bg-gradient-to-r from-purple-300 to-pink-200 bg-clip-text text-transparent">
                  Get Started Now
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-white/10 to-transparent -skew-x-12 transition-all duration-500 group-hover:left-0" />
            </Link>
          </div>

      </div>

      <div className="absolute w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-gradient 
                from-blue-500/20 via-transparent to-transparent pointer-events-none transition-all duration-1000"
           style={{
             left: `${cursorPosition.x}px`,
             top: `${cursorPosition.y}px`,
             opacity: 0.3
           }} />
    </div>
  );
}

export default Home;
