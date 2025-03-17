// tabs/ReportsTab.js
import React, { useState, useEffect } from 'react';
import CrudTab from './CrudTab';

const ReportsTab = (props) => (
  <CrudTab
    {...props}
    columns={['generationDate', 'totalIncome', 'totalExpenses', 'netProfit', 'taxPaid']}
    endpoint="reports"
  />
);

export default ReportsTab;