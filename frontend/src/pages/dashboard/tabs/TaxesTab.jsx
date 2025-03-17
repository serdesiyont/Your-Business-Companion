// tabs/TaxesTab.js
import React, { useState, useEffect } from 'react';
import CrudTab from './CrudTab';

const TaxesTab = (props) => (
  <CrudTab
    {...props}
    columns={['taxRate', 'applicableCategory']}
    endpoint="taxes"
  />
);

export default TaxesTab;