import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../utils/api'

export default function CategoryBreakdownChart(){
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await api.get('/dashboard/category-breakdown')
      setData(res.data.map(c => ({ name: c.name, value: parseFloat(c.revenue) })))
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
    setLoading(false)
  }

  if (loading) return <div className="p-4 bg-white rounded shadow">Loading...</div>

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-4">Revenue by Category</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ₹${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-gray-500 text-center py-8">No data available</div>
      )}
    </div>
  )
}
