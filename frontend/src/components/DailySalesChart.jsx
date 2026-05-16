import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import api from '../utils/api'

export default function DailySalesChart(){
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await api.get('/dashboard/daily-sales')
      setData(res.data)
    } catch (err) {
      console.error('Failed to fetch sales chart:', err)
    }
    setLoading(false)
  }

  if (loading) return <div className="p-4 bg-white rounded shadow">Loading chart...</div>

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-4">Daily Sales (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
