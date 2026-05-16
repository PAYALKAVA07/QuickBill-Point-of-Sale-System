import React, { useState, useEffect } from 'react'
import api from '../utils/api'

export default function ProductSearch({ onAdd }){
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const id = setTimeout(()=>{ if(q) search(q) }, 300)
    if(!q) setResults([])
    return ()=>clearTimeout(id)
  },[q])

  const search = async (term) =>{
    setLoading(true)
    try{
      const res = await api.get(`/products?q=${encodeURIComponent(term)}&limit=20`)
      setResults(res.data.rows || res.data)
    }catch(err){ console.error(err) }
    setLoading(false)
  }

  return (
    <div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products by name/SKU/barcode" className="w-full p-2 border rounded mb-2" />
      <div className="max-h-64 overflow-auto">
        {loading && <div className="p-2 text-sm">Searching...</div>}
        {results.map(p=> (
          <div key={p.id} className="flex items-center justify-between p-2 border-b">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-500">SKU: {p.sku} • Stock: {p.stockQuantity}</div>
            </div>
            <div className="flex items-center">
              <div className="mr-4">₹{parseFloat(p.sellingPrice).toFixed(2)}</div>
              <button onClick={()=> onAdd({ productId: p.id, name: p.name, price: p.sellingPrice, tax: p.taxPercentage })} className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
