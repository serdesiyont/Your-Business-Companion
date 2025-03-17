import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  ReceiptPercentIcon,
  CubeIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [merchant, setMerchant] = useState(null);
  const [shops, setShops] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const menuItems = [
    // { id: "overview", label: "Overview", icon: HomeIcon },
    { id: "taxes", label: "Taxes", icon: ReceiptPercentIcon },
    { id: "reports", label: "Reports", icon: DocumentChartBarIcon },
    { id: "transactions", label: "Transactions", icon: CurrencyDollarIcon },
    { id: "products", label: "Products", icon: CubeIcon },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch merchant data
        // const merchantRes = await fetch('/api/merchant', { headers });
        const merchantRes = await fetch("/merchant.json");
        const merchantData = await merchantRes.json();
        setMerchant(merchantData);

        // Fetch all other data concurrently
        // const [shopsRes, transactionsRes, productsRes, taxesRes, reportsRes] = await Promise.all([
        //   fetch('/api/shops', { headers }),
        //   fetch('/api/transactions', { headers }),
        //   fetch('/api/products', { headers }),
        //   fetch('/api/taxes', { headers }),
        //   fetch('/api/reports', { headers }),
        // ]);

        const [ transactionsRes, productsRes, taxesRes, reportsRes] =
          await Promise.all([
            
            fetch("/transactions.json"),
            fetch("/api/products"),
            fetch("/taxes.json"),
            fetch("/reports.json"),
          ]);

        
        setTransactions(await transactionsRes.json());
        setProducts(await productsRes.json());
        setTaxes(await taxesRes.json());
        setReports(await reportsRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem("authToken")) navigate("/login");
    else fetchData();
  }, [navigate]);

  // CRUD Operations
  const handleCRUD = async (method, endpoint, data, id) => {
    try {
      const token = localStorage.getItem("authToken");
      const url = id ? `/api/${endpoint}/${id}` : `/api/${endpoint}`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log(`Status for ${url}:`, response.status, response.statusText);

      // Optionally, log the raw response text for debugging:
      const text = await response.text();
      console.log(`Response text for ${url}:`, text);

      // Try parsing JSON if the response is not empty
      if (!response.ok) {
        throw new Error(
          `Operation failed: ${response.status} ${response.statusText}`
        );
      }

      // If response text is empty, throw an error
      if (!text) {
        throw new Error("Empty response from server");
      }

      return JSON.parse(text);
    } catch (error) {
      console.error("CRUD Error:", error);
      return null;
    }
  };

  const renderContent = () => {
    if (loading)
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );

    const commonProps = {
      searchTerm,
      setSearchTerm,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      handleCRUD,
    };

    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            merchant={merchant}
            shops={shops}
            transactions={transactions}
          />
        );
      case "shops":
        return (
          <CrudTab
            data={shops}
            columns={[
              "shopName",
              "location",
              "registrationDate",
              "category",
              "totalIncome",
              "totalExpenses",
              "netProfit",
            ]}
            endpoint="shops"
            {...commonProps}
          />
        );
      case "taxes":
        return (
          <CrudTab
            data={taxes}
            columns={["tax_amount", "tax_rate", "tax_date", "description"]}
            endpoint="taxes"
            {...commonProps}
          />
        );
      case "reports":
        return (
          <CrudTab
            data={reports}
            columns={[
             

              "description",  "amount",  "date", "category",
            ]}
            endpoint="reports"
            {...commonProps}
          />
        );
      case "transactions":
        return (
          <CrudTab
            data={transactions}
            columns={[
              
              

              "product_name",
              "quantity",
              "sale_date",
              "sale_price",
            ]}
            endpoint="transactions"
            {...commonProps}
          />
        );
      case "products":
        return (
          <CrudTab
            data={products}
            columns={[
              "product_name",
              "description",
              "initial_stock",
              "price",
              "category",
            ]}
            endpoint="products"
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          {isSidebarOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="w-6 h-6" />
            ) : (
              <ChevronRightIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-6 h-6" />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
            {merchant && (
              <p className="text-sm text-gray-400">
                {merchant.name} - {merchant.taxID}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              navigate("/login");
            }}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

const OverviewTab = ({ merchant, shops, transactions }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-gray-400 text-sm mb-2">Total Shops</h3>
        <p className="text-3xl font-bold">{shops.length}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-gray-400 text-sm mb-2">Net Profit</h3>
        <p className="text-3xl font-bold">
          $
          {shops
            .reduce((sum, shop) => sum + (shop.revenue || 0), 0)
            .toLocaleString()}
        </p>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-gray-400 text-sm mb-2">Registration Date</h3>
        <p className="text-3xl font-bold">
          {merchant
            ? new Date(merchant.registrationDate).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </div>

    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={transactions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#6366f1" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const CrudTab = ({
  data,
  columns,
  endpoint,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleCRUD,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formState, setFormState] = useState({});

  // Define filtering and pagination functions locally
  const filteredData = (data) =>
    data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const paginatedData = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const filtered = filteredData(data);
  const paginated = paginatedData(filtered);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const openModal = (item = null) => {
    setSelectedItem(item);
    setFormState(item || {}); // If editing, pre-fill form state
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormState({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with state:", formState);
    const method = selectedItem ? "PUT" : "POST";
    const result = await handleCRUD(
      method,
      endpoint,
      formState,
      selectedItem?.id
    );
    console.log("Result from CRUD:", result);
    if (result) {
      closeModal();
      // Optionally update the parent state or trigger a data refresh here.
    } else {
      alert("Failed to save data");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent outline-none"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add New</span>
          </button>
          <input
            type="file"
            accept=".csv"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const text = await file.text();
                const rows = text.split("\n").slice(1);
                const newData = rows.map((row) => {
                  const values = row.split(",");
                  const item = {};
                  columns.forEach((col, index) => {
                    item[col] = values[index];
                  });
                  return item;
                });
                console.log("Parsed CSV data:", newData);
              }
            }}
            className="hidden"
            id="csvUpload"
          />
          <label
            htmlFor="csvUpload"
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg cursor-pointer"
          >
            <span>Upload CSV</span>
          </label>
        </div>
      </div>

      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col} className="p-4 text-left text-sm font-medium">
                {col.toUpperCase()}
              </th>
            ))}
            <th className="p-4 text-right text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((item) => (
            <tr
              key={item.id}
              className="border-t border-gray-700 hover:bg-gray-750"
            >
              {columns.map((col) => (
                <td key={col} className="p-4 text-sm">
                  {item[col]}
                </td>
              ))}
              <td className="p-4 text-right space-x-2">
                <button
                  onClick={() => openModal(item)}
                  className="text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCRUD("DELETE", endpoint, null, item.id)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for CRUD Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl mb-4">
              {selectedItem ? "Edit" : "Add New"} {endpoint.slice(0, -1)}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {columns.map((col) => (
                <div key={col} className="flex flex-col">
                  <label className="mb-1 text-sm">{col.toUpperCase()}</label>
                  <input
                    type="text"
                    value={formState[col] || ""}
                    onChange={(e) =>
                      setFormState({ ...formState, [col]: e.target.value })
                    }
                    className="p-2 bg-gray-700 rounded outline-none"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
