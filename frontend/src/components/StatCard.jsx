import React from 'react'

export default function StatCard({ title, value, icon, color = 'blue' }){
  const bgColor = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100'
  }[color] || 'bg-blue-100'

  const textColor = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  }[color] || 'text-blue-600'

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
        <div className={`${bgColor} ${textColor} p-3 rounded text-lg`}>{icon}</div>
      </div>
    </div>
  )
}
