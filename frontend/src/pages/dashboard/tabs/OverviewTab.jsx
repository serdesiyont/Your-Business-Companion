// tabs/OverviewTab.js
import React, { useState, useEffect } from 'react';
import { ShoppingBagIcon, CurrencyDollarIcon, DocumentChartBarIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OverviewTab = ({ transactions }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { 
          label: 'Total Shops', 
          value: shops.length,
          icon: ShoppingBagIcon,
          bg: 'from-blue-900/30 to-blue-800/20',
          color: 'text-blue-400'
        },
        { 
          label: 'Net Profit', 
          value: `$${shops.reduce((sum, shop) => sum + (shop.totalIncome - shop.totalExpenses), 0).toLocaleString()}`,
          icon: CurrencyDollarIcon,
          bg: 'from-green-900/30 to-green-800/20',
          color: 'text-green-400'
        },
        { 
          label: 'Registration Date', 
          value: merchant ? new Date(merchant.registrationDate).toLocaleDateString() : 'N/A',
          icon: DocumentChartBarIcon,
          bg: 'from-purple-900/30 to-purple-800/20',
          color: 'text-purple-400'
        }
      ].map((metric, i) => (
        <div 
          key={i} 
          className={`bg-gradient-to-br ${metric.bg} backdrop-blur-sm border border-gray-800/50 p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">{metric.label}</h3>
              <p className={`text-2xl font-bold ${metric.color} truncate`}>{metric.value}</p>
            </div>
            <metric.icon className={`w-8 h-8 ${metric.color}/20`} />
          </div>
        </div>
      ))}
    </div>

    <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 backdrop-blur-sm border border-gray-800/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Revenue Trend
          </h3>
          <p className="text-sm text-gray-400 mt-1">Last 30 days</p>
        </div>
        <span className="bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <CurrencyDollarIcon className="w-4 h-4" />
          USD
        </span>
      </div>
      
      <div className="h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={transactions}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 5" strokeOpacity={0.15} stroke="#4f46e5" />
            <XAxis 
              dataKey="dateTime" 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: '0.75rem' }} 
              tickFormatter={(tick) => new Date(tick).toLocaleDateString('short')}
              tickLine={{ stroke: '#64748b' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: '0.75rem' }} 
              tickLine={{ stroke: '#64748b' }}
              orientation="right"
              padding={{ right: 0 }}
            />
            <Tooltip 
              content={({ payload }) => (
                <div className="bg-gray-900/50 backdrop-blur-sm p-3 rounded-lg shadow-2xl border border-gray-700">
                  <p className="font-bold text-amber-400">
                    ${payload?.[0]?.value?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    {payload?.[0]?.payload.dateTime ? 
                      new Date(payload[0].payload.dateTime).toLocaleDateString() : ''
                    }
                  </p>
                </div>
              )}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="url(#revenueGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: "#f59e0b",
                strokeWidth: 2,
                className: "animate-pulse"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default OverviewTab;