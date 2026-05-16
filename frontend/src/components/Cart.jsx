import React from 'react'

export default function Cart({ items, onInc, onDec, onRemove, onCheckout }){
  const subtotal = items.reduce((s,it)=> s + parseFloat(it.price) * it.quantity, 0)
  const tax = items.reduce((s,it)=> s + (parseFloat(it.tax || 0) * it.quantity), 0)
  const total = subtotal + tax

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Cart</h3>
      <div className="space-y-2 max-h-56 overflow-auto">
        {items.length===0 && <div className="text-sm text-gray-500">Cart is empty</div>}
        {items.map(it=> (
          <div key={it.productId} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-xs text-gray-500">₹{parseFloat(it.price).toFixed(2)}</div>
            </div>
            <div className="flex items-center">
              <button onClick={()=>onDec(it.productId)} className="px-2">-</button>
              <div className="px-2">{it.quantity}</div>
              <button onClick={()=>onInc(it.productId)} className="px-2">+</button>
              <button onClick={()=>onRemove(it.productId)} className="ml-2 text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex justify-between"><div>Subtotal</div><div>₹{subtotal.toFixed(2)}</div></div>
        <div className="flex justify-between"><div>Tax</div><div>₹{tax.toFixed(2)}</div></div>
        <div className="flex justify-between font-semibold mt-2"><div>Total</div><div>₹{total.toFixed(2)}</div></div>
      </div>

      <button disabled={items.length===0} onClick={onCheckout} className="mt-4 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">Checkout</button>
    </div>
  )
}
