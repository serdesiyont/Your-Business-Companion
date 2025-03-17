// Header.js
const Header = ({ merchant, activeTab }) => (
    <header className="bg-gray-950/60 p-3 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-700">
      <div className="order-1 sm:order-none">
        <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
        {merchant && (
          <p className="text-sm text-gray-400 truncate">
            {merchant.name} - {merchant.taxID}
          </p>
        )}
      </div>
    </header>
  );
  
  export default Header;