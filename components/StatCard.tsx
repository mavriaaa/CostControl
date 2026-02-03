
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'green' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isPositive, icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '↑' : '↓'} {trend} <span className="text-gray-400 ml-1">geçen aya göre</span>
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
