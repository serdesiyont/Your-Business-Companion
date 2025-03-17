import React, { useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom'
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/login/Login';
import Signup from './pages/login/Signup';
// import Dashboard from './pages/Dashboard';
import Chat from './components/chatapp/Chat';
import Dashboard from './pages/dashboard/Dashboard';
import TestPage from './pages/TestPage'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  
  localStorage.setItem("authToken", "test-token");

   
   

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        {/* Mobile Menu */}
        <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        {/* Main Content */}
        <div className="flex-grow mt-16"> {/* Adjusts content space */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/graph" element={<TestPage />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
