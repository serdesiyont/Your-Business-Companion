// tabs/TransactionsTab.js
import React, { useState, useEffect } from 'react';
import CrudTab from './CrudTab';

const TransactionsTab = (props) => (
  <CrudTab
    {...props}
    columns={['dateTime','transactionType', 'amount', 'taxAmount', 'totalAmount']}
    endpoint="transactions"
  />
);

export default TransactionsTab;