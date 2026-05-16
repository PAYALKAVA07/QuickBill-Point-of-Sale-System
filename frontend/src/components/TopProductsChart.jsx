import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../utils/api'

export default function TopProductsChart(){
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await api.get('/dashboard/top-products')
      setData(res.data)
    } catch (err) {
      console.error('Failed to fetch top products:', err)
    }
    setLoading(false)
  }

  if (loading) return <div className="p-4 bg-white rounded shadow">Loading...</div>

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-4">Top 5 Products</h3>
      <div className="space-y-2">
        {data.map((p, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="w-32 truncate text-sm">{p.name}</div>
            <div className="flex-1 mx-4 bg-gray-200 rounded h-2">
              <div className="bg-blue-600 h-2 rounded" style={{ width: `${Math.min(100, (parseInt(p.quantity) / 20) * 100)}%` }}></div>
            </div>
            <div className="text-sm">{p.quantity} sold</div>
          </div>
        ))}
      </div>
    </div>
  )
}
