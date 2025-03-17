// Dashnavmob.js
const Dashnavmob = ({ activeTab, setActiveTab, menuItems }) => (
  <div className="md:hidden fixed bottom-0 left-0 p-0 mb-0 right-0 z-49 bg-gray-950/60 backdrop-blur-lg border-t border-gray-700/50 rounded-t-2xl">
    <nav className="flex justify-evenly p-2">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`relative flex flex-col items-center p-2.5 transition-all duration-200 ${
            activeTab === item.id ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {activeTab === item.id && <div className="absolute -top-3 w-12 h-1 bg-blue-400 rounded-full"></div>}
          <item.icon className={`w-7 h-7 transition-transform ${activeTab === item.id ? 'scale-110' : 'scale-100'}`} />
          <span className={`text-xs font-medium mt-1 ${activeTab === item.id ? 'text-blue-400' : 'text-gray-400'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  </div>
);

export default Dashnavmob;