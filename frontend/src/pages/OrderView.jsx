import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import html2canvas from 'html2canvas'
// import jsPDF from 'jsPDF'
import jsPDF from "jspdf";

export default function OrderView(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  const ref = useRef();

  useEffect(()=>{ fetchOrder(); },[id]);
  const fetchOrder = async ()=>{
    const token = localStorage.getItem('token');
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}/invoice`, { headers: { Authorization: `Bearer ${token}` } });
    setData(res.data);
  }

  const downloadPDF = async () =>{
    const el = ref.current;
    const canvas = await html2canvas(el, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p','pt','a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.order.invoiceNumber || 'invoice'}.pdf`);
  }

  if(!data) return <div className="p-6">Loading...</div>

  const { store, order } = data;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl">Invoice {order.invoiceNumber}</h2>
        <div>
          <button className="mr-2 px-3 py-1 bg-blue-600 text-white rounded" onClick={downloadPDF}>Download PDF</button>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => window.print()}>Print</button>
        </div>
      </div>

      <div ref={ref} className="bg-white p-6 shadow max-w-2xl">
        <div className="flex justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">{store.name}</h3>
            <div className="text-sm">{store.address}</div>
            <div className="text-sm">GST: {store.gst}</div>
          </div>
          <div className="text-sm">
            <div>Invoice: {order.invoiceNumber}</div>
            <div>Date: {new Date(order.createdAt).toLocaleString()}</div>
            <div>Payment: {order.paymentMethod}</div>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Product</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.OrderItems.map(it=> (
              <tr key={it.id} className="border-b">
                <td className="py-2">{it.name}</td>
                <td className="py-2 text-right">{it.quantity}</td>
                <td className="py-2 text-right">{parseFloat(it.price).toFixed(2)}</td>
                <td className="py-2 text-right">{(parseFloat(it.price)*it.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="w-64">
            <div className="flex justify-between"><div>Subtotal</div><div>{parseFloat(order.subtotal).toFixed(2)}</div></div>
            <div className="flex justify-between"><div>Tax</div><div>{parseFloat(order.tax).toFixed(2)}</div></div>
            <div className="flex justify-between"><div>Discount</div><div>{parseFloat(order.discount).toFixed(2)}</div></div>
            <div className="flex justify-between font-semibold"><div>Total</div><div>{parseFloat(order.total).toFixed(2)}</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
