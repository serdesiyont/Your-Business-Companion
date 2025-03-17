import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  ArrowUturnLeftIcon,
  ArrowDownTrayIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';

const CrudTab = ({ data, columns, endpoint, searchTerm, setSearchTerm, currentPage, setCurrentPage, itemsPerPage, handleCRUD }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formState, setFormState] = useState({});
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortedData, setSortedData] = useState(data);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(null);

  const ID_FIELD_MAP = {
    products: 'id',
    transactions: 'id',
    taxes: 'id',
    reports: 'id',
  };

  const idField = ID_FIELD_MAP[endpoint] || 'id';

  useEffect(() => {
    setSortedData([...data]);
  }, [data]);

  const handleSort = (col) => {
    const newDirection = sortColumn === col && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(col);
    setSortDirection(newDirection);

    const sorted = [...data].sort((a, b) => {
      const aValue = a[col] ?? '';
      const bValue = b[col] ?? '';
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return newDirection === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setSortedData(sorted);
  };

  const filteredData = sortedData.filter(item =>
    columns.some(col =>
      String(item[col] ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginated = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleDownloadCSV = () => {
    const csvData = filteredData.length > 0 ? filteredData : data;
    const csvHeaders = columns.map(col => `"${formalColumnNames[col] || col}"`).join(',');
    const csvRows = csvData.map(item =>
      columns.map(col => `"${String(item[col] ?? '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvHeaders + '\n' + csvRows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${endpoint}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDelete = async () => {
    if (!selectedRows.length) return;
    
    try {
      const confirmDelete = window.confirm(`Delete ${selectedRows.length} items?`);
      if (!confirmDelete) return;

      await Promise.all(selectedRows.map(id => 
        handleCRUD('DELETE', endpoint, null, id)
      ));
      setSelectedRows([]);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Bulk delete failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const method = selectedItem ? 'PUT' : 'POST';
      const result = await handleCRUD(method, endpoint, formatFormData(formState), selectedItem?.[idField]);
      
      if (result) {
        closeModal();
        setCurrentPage(1);
        setSearchTerm('');
      }
    } catch (error) {
      setError(error.message);
      console.error('Form submission failed:', error);
    }
  };

  const formatFormData = (data) => {
    const formatted = { ...data };
    const dateFields = ['dateTime', 'generationDate', 'registrationDate'];
    
    dateFields.forEach(field => {
      if (formatted[field]) {
        const date = new Date(formatted[field]);
        if (!isNaN(date)) {
          formatted[field] = date.toISOString();
        }
      }
    });

    return formatted;
  };

  const openModal = (item = null) => {
    setSelectedItem(item);
    setFormState(item ? { ...item } : {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormState({});
    setError(null);
  };

  const formalColumnNames = {
    product_name: 'Product Name',
    description: 'Description',
    initial_stock: 'Initial Stock',
    price: 'Price',
    category: 'Category',
    // other existing mappings...
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900/30 text-red-300 rounded-lg border border-red-800/50">
          Error: {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center bg-gray-900 p-2 rounded-lg flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mx-2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent outline-none w-full"
          />
        </div>

        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="hidden md:inline">Add New</span>
            <span className="md:hidden">Add</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span className="hidden md:inline">Download CSV</span>
            <span className="md:hidden">Download</span>
          </button>

          <div className="relative">
            <input type="file" id="csvUpload" className="hidden" />
            <label
              htmlFor="csvUpload"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors cursor-pointer"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span className="hidden md:inline">Upload CSV</span>
              <span className="md:hidden">Upload</span>
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full bg-gray-900/50">
            <thead className="bg-gray-900 sticky top-0">
              <tr>
                <th className="p-3 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && paginated.every(item => 
                      selectedRows.includes(item[idField]))
                    }
                    onChange={(e) => {
                      const ids = paginated.map(item => item[idField]);
                      e.target.checked 
                        ? setSelectedRows([...new Set([...selectedRows, ...ids])])
                        : setSelectedRows(selectedRows.filter(id => !ids.includes(id)));
                    }}
                    className="form-checkbox h-4 w-4 text-blue-400 rounded focus:ring-blue-500 border-gray-500 bg-gray-700"
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="p-3 text-left text-sm font-medium min-w-[120px] cursor-pointer hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      {formalColumnNames[col]}
                      {sortColumn === col && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-3 text-right text-sm font-medium min-w-[130px]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((item) => {
                const itemId = item[idField];
                return (
                  <tr
                    key={itemId}
                    className={`border-t border-gray-700 ${
                      selectedRows.includes(itemId) 
                        ? 'bg-blue-700/20' 
                        : 'hover:bg-gray-800/30'
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(itemId)}
                        onChange={(e) => {
                          e.target.checked
                            ? setSelectedRows([...selectedRows, itemId])
                            : setSelectedRows(selectedRows.filter(id => id !== itemId));
                        }}
                        className="form-checkbox cursor-pointer h-4 w-4 text-blue-400 rounded focus:ring-blue-500 border-gray-500 bg-gray-700"
                      />
                    </td>
                    {columns.map((col) => (
                      <td
                        key={`${col}-${itemId}`}
                        className="p-3 text-sm truncate max-w-[200px]"
                      >
                        {col === 'transactionType' ? (
                          <div className="flex items-center gap-2">
                            {item[col] === 'debit' ? (
                              <ArrowDownCircleIcon className="w-5 h-5 text-red-500" />
                            ) : (
                              <ArrowUpCircleIcon className="w-5 h-5 text-green-500" />
                            )}
                            <span>{item[col]}</span>
                          </div>
                        ) : (
                          (col.endsWith('Date') || col === 'dateTime') && item[col]
                            ? new Date(item[col]).toLocaleDateString()
                            : item[col]
                        )}
                      </td>
                    ))}
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 hover:text-blue-100 border border-blue-800/30 hover:border-blue-500/50"
                        >
                          <PencilIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleCRUD('DELETE', endpoint, null, itemId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-900/20 hover:bg-red-900/40 text-red-300 hover:text-red-100 border border-red-800/30 hover:border-red-500/50"
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
            Delete Selected ({selectedRows.length})
          </button>
        </div>
      )}

      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">
                {selectedItem ? 'Edit' : 'Create'} {endpoint.slice(0, -1)}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 hover:bg-gray-700/50 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {columns.map((col) => (
                <div key={col} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">
                    {formalColumnNames[col]}
                  </label>
                  {col === 'transactionType' ? (
                    <select
                      value={formState[col] || ''}
                      onChange={(e) => setFormState({ ...formState, [col]: e.target.value })}
                      className="p-2 text-sm bg-gray-700 rounded-lg outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                    </select>
                  ) : (col.endsWith('Date') || col === 'dateTime') ? (
                    <input
                      type="datetime-local"
                      value={formState[col] || ''}
                      onChange={(e) => setFormState({ ...formState, [col]: e.target.value })}
                      className="p-2 text-sm bg-gray-700 rounded-lg outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formState[col] || ''}
                      onChange={(e) => setFormState({ ...formState, [col]: e.target.value })}
                      className="p-2 text-sm bg-gray-700 rounded-lg outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors"
                >
                  {selectedItem ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudTab;