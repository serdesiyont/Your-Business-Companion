import React from 'react';
import CrudTab from './CrudTab';

const ProductsTab = ({ data, ...props }) => {
  const columns = [
    "product_name",
    "description",
    "initial_stock",
    "price",
    "category",
  ];

  return (
    <CrudTab
      data={data}
      columns={columns}
      endpoint="products"
      {...props}
    />
  );
};

export default ProductsTab;