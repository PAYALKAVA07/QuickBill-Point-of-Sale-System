import React, { useState } from 'react'
import ProductSearch from '../components/ProductSearch'
import Cart from '../components/Cart'
import api from '../utils/api'

export default function POS(){
  const [items, setItems] = useState([])

  const handleAdd = (p) =>{
    setItems(prev=>{
      const found = prev.find(x=>x.productId===p.productId)
      if(found) return prev.map(x=> x.productId===p.productId ? { ...x, quantity: x.quantity+1 } : x)
      return [...prev, { ...p, quantity: 1 }]
    })
  }

  const inc = (id) => setItems(prev => prev.map(i=> i.productId===id ? { ...i, quantity: i.quantity+1 } : i))
  const dec = (id) => setItems(prev => prev.map(i=> i.productId===id ? { ...i, quantity: Math.max(1,i.quantity-1) } : i))
  const remove = (id) => setItems(prev => prev.filter(i=> i.productId!==id))

  const checkout = async () =>{
    try{
      const payload = { items: items.map(i=> ({ productId: i.productId, quantity: i.quantity, price: i.price, tax: i.tax })), paymentMethod: 'cash' }
      const res = await api.post('/orders', payload)
      const id = res.data.orderId
      window.location.href = `/orders/${id}`
    }catch(err){
      console.error(err)
      alert(err.response?.data?.message || 'Checkout failed')
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">POS</h2>
        <div>
          <a href="/" className="text-sm text-blue-600">Back to Dashboard</a>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ProductSearch onAdd={handleAdd} />
        </div>
        <div>
          <Cart items={items} onInc={inc} onDec={dec} onRemove={remove} onCheckout={checkout} />
        </div>
      </div>
    </div>
  )
}
