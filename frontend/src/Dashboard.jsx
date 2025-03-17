import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './components/dashboard/Header';
import { Sidebar } from './components/dashboard/Sidebar';
import { MobileNav } from './components/dashboard/MobileNav';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { CrudTab } from './components/dashboard/CrudTab';
import { LoadingSpinner } from './components/dashboard/LoadingSpinner';
import { menuItems } from "@/config.js";


const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  // ... other state and useEffect

  return (
    <div className="min-h-screen bg-gray-950/60 text-gray-100 flex">
      <MobileNav {...mobileNavProps} />
      <Sidebar {...sidebarProps} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} merchant={merchant} />
        
        <main className="flex-1 overflow-auto p-4">
          {loading ? <LoadingSpinner /> : renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;