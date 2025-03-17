import React, { useState, useEffect } from "react";

function ProductPerformanceReport() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch("/api/product_performance_report"); // Your Flask endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReport(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchReport();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!report) {
    return <div>Loading report...</div>;
  }

  return (
    <div>
      <h2>Product Sales Performance</h2>

      <h3>Total Sales per Product</h3>
      <ul>
        {Object.entries(report.product_sales).map(([product, sales]) => (
          <li key={product}>
            {product}: ${sales.toFixed(2)}
          </li>
        ))}
      </ul>

      <h3>Sales Trend Chart</h3>
      {report.sales_trend_chart ? (
        <img
          src={`data:image/png;base64,${report.sales_trend_chart}`}
          alt="Sales Trend Chart"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      ) : (
        <div>No chart available.</div>
      )}
    </div>
  );
}

export default ProductPerformanceReport;
