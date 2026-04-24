import React from 'react';

export default function StatCard({ title, value, icon, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      bg: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-400/30',
    },
    violet: {
      bg: 'from-violet-500 to-violet-600',
      iconBg: 'bg-violet-400/30',
    },
    pink: {
      bg: 'from-pink-500 to-pink-600',
      iconBg: 'bg-pink-400/30',
    },
    emerald: {
      bg: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-400/30',
    },
    amber: {
      bg: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-400/30',
    },
    cyan: {
      bg: 'from-cyan-500 to-cyan-600',
      iconBg: 'bg-cyan-400/30',
    },
    rose: {
      bg: 'from-rose-500 to-rose-600',
      iconBg: 'bg-rose-400/30',
    },
    teal: {
      bg: 'from-teal-500 to-teal-600',
      iconBg: 'bg-teal-400/30',
    },
  };

  const colors = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${colors.bg} p-5 shadow hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        {icon && (
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full ${colors.iconBg} text-2xl`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}