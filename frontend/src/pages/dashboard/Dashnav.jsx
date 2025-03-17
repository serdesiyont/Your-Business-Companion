import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const Dashnav = ({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, menuItems }) => (
  <div className={`hidden md:block bg-gray-950/60 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
    <div className="p-4 flex justify-between items-center border-b border-gray-700">
      {isSidebarOpen && <h1 className="text-xl font-bold text-center w-full">Dashboard</h1>}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 hover:bg-gray-700 rounded-lg"
      >
        {isSidebarOpen ? <ChevronLeftIcon className="w-6 h-6" /> : <ChevronRightIcon className="w-6 h-6" />}
      </button>
    </div>
    <nav className="p-4 space-y-2">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeTab === item.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
          }`}
        >
          <item.icon className="w-6 h-6" />
          {isSidebarOpen && <span>{item.label}</span>}
        </button>
      ))}
    </nav>
  </div>
);

export default Dashnav;