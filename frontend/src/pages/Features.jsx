import React from "react";
import { SparklesIcon, CpuChipIcon, ClockIcon, LockClosedIcon, CommandLineIcon, GlobeAltIcon } from "@heroicons/react/24/solid";

function Features() {
  const features = [
    { 
      title: "AI-Powered Assistance",
      icon: <CpuChipIcon className="w-6 h-6" />,
      color: "from-purple-400 to-blue-400"
    },
    { 
      title: "Real-Time Insights",
      icon: <SparklesIcon className="w-6 h-6" />,
      color: "from-cyan-400 to-blue-400"
    },
    { 
      title: "Smart Integration",
      icon: <CommandLineIcon className="w-6 h-6" />,
      color: "from-green-400 to-cyan-400"
    },
    { 
      title: "Security",
      icon: <LockClosedIcon className="w-6 h-6" />,
      color: "from-red-400 to-orange-400"
    },
    { 
      title: "Adaptive Workflows",
      icon: <GlobeAltIcon className="w-6 h-6" />,
      color: "from-yellow-400 to-amber-400"
    },
    { 
      title: "24/7 Availability",
      icon: <ClockIcon className="w-6 h-6" />,
      color: "from-pink-400 to-rose-400"
    },
  ];

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

      <div className="max-w-6xl w-full text-center relative z-10">
        <h2 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-shift hover:animate-pulse 
          transition-all duration-300 cursor-default">
          Next-Gen AI Capabilities
        </h2>
        
        <p className="text-xl text-gray-300 leading-relaxed mb-12 max-w-2xl mx-auto animate-fade-in delay-100">
          Empower your workflow with our intelligent agent's cutting-edge features
        </p>

        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative cursor-pointer bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Gradient highlight */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
              
              <div className="relative flex flex-col items-center">
                <div className={`mb-4 p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                  {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent group-hover:via-blue-400 transition-all duration-300" />
                <span className="mt-3 text-sm text-gray-400 group-hover:text-blue-300 transition-colors">
                  0{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;