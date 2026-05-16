// import React, { useState } from 'react'
// import api from '../utils/api'

// export default function Reports(){
//   const [reportType, setReportType] = useState('sales')
//   const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0])
//   const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
//   const [data, setData] = useState(null)
//   const [summary, setSummary] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const reportTitles = {
//     sales: 'Sales Report',
//     inventory: 'Inventory Report',
//     profit: 'Profit Report',
//     tax: 'Tax Report'
//   }

//   const generateReport = async () => {
//     setLoading(true)
//     try {
//       const params = `startDate=${startDate}&endDate=${endDate}`
//       const res = await api.get(`/reports/${reportType}?${params}`)
//       setData(res.data.report)
//       setSummary(res.data.summary)
//     } catch (err) {
//       console.error('Failed to generate report:', err)
//       alert('Error generating report')
//     }
//     setLoading(false)
//   }

//   const exportReport = async (format) => {
//     try {
//       const params = `startDate=${startDate}&endDate=${endDate}&format=${format}`
//       const res = await api.get(`/reports/${reportType}?${params}`, { responseType: 'blob' })
      
//       const url = window.URL.createObjectURL(new Blob([res.data]))
//       const link = document.createElement('a')
//       link.href = url
//       link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format === 'xlsx' ? 'xlsx' : format === 'csv' ? 'csv' : 'pdf'}`)
//       document.body.appendChild(link)
//       link.click()
//       link.parentNode.removeChild(link)
//     } catch (err) {
//       console.error('Export failed:', err)
//       alert('Export failed')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold">Reports</h1>
//         <div>
//           <a href="/" className="mr-2 text-sm text-blue-600">Back to Dashboard</a>
//           <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login' }} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Logout</button>
//         </div>
//       </header>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//         <div className="lg:col-span-1 p-4 bg-white rounded shadow h-fit">
//           <h3 className="font-semibold mb-4">Report Type</h3>
//           <div className="space-y-2">
//             {Object.entries(reportTitles).map(([key, title]) => (
//               <label key={key} className="flex items-center">
//                 <input type="radio" name="report" value={key} checked={reportType === key} onChange={e => setReportType(e.target.value)} className="mr-2" />
//                 <span className="text-sm">{title}</span>
//               </label>
//             ))}
//           </div>

//           <h3 className="font-semibold mt-6 mb-4">Date Range</h3>
//           <div className="space-y-2">
//             <div>
//               <label className="text-xs text-gray-600">Start Date</label>
//               <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border rounded text-sm" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">End Date</label>
//               <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 border rounded text-sm" />
//             </div>
//           </div>

//           <button onClick={generateReport} disabled={loading} className="w-full mt-4 bg-blue-600 text-white py-2 rounded disabled:opacity-50">
//             {loading ? 'Loading...' : 'Generate Report'}
//           </button>

//           {data && (
//             <div className="mt-6">
//               <h3 className="font-semibold mb-2">Export</h3>
//               <div className="space-y-2">
//                 <button onClick={() => exportReport('xlsx')} className="w-full bg-green-600 text-white py-1 rounded text-sm">📊 Export XLSX</button>
//                 <button onClick={() => exportReport('csv')} className="w-full bg-blue-600 text-white py-1 rounded text-sm">📄 Export CSV</button>
//                 <button onClick={() => exportReport('pdf')} className="w-full bg-red-600 text-white py-1 rounded text-sm">📑 Export PDF</button>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="lg:col-span-3">
//           {summary && (
//             <div className="p-4 bg-white rounded shadow mb-6">
//               <h3 className="font-semibold mb-4">Summary</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {Object.entries(summary).map(([key, value]) => (
//                   <div key={key} className="p-3 bg-gray-100 rounded">
//                     <div className="text-xs text-gray-600">{key}</div>
//                     <div className="font-semibold">{value}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {data && (
//             <div className="p-4 bg-white rounded shadow">
//               <h3 className="font-semibold mb-4">{reportTitles[reportType]} Data</h3>
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse text-sm">
//                   <thead>
//                     <tr className="border-b">
//                       {Object.keys(data[0] || {}).map(col => (
//                         <th key={col} className="text-left py-2 px-2">{col}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.map((row, i) => (
//                       <tr key={i} className="border-b hover:bg-gray-50">
//                         {Object.values(row).map((val, j) => (
//                           <td key={j} className="py-2 px-2">{val}</td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {!data && !loading && (
//             <div className="p-8 bg-white rounded shadow text-center text-gray-500">
//               Select report type and click "Generate Report" to view data
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }




import React, { useState } from 'react'
import api from '../utils/api'

export default function Reports() {
  const [reportType, setReportType] = useState('sales')
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [data, setData] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  const reportTitles = {
    sales: 'Sales Report',
    inventory: 'Inventory Report',
    profit: 'Profit Report',
    tax: 'Tax Report'
  }

  const generateReport = async () => {
    setLoading(true)
    try {
      const params = `startDate=${startDate}&endDate=${endDate}`
      const res = await api.get(`/reports/${reportType}?${params}`)
      setData(res.data.report)
      setSummary(res.data.summary)
    } catch (err) {
      console.error('Failed to generate report:', err)
      alert('Error generating report')
    }
    setLoading(false)
  }

  const exportReport = async (format) => {
    try {
      const params = `startDate=${startDate}&endDate=${endDate}&format=${format}`
      const res = await api.get(`/reports/${reportType}?${params}`, { responseType: 'blob' })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format === 'xlsx' ? 'xlsx' : format === 'csv' ? 'csv' : 'pdf'}`
      )
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Export failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-800 p-6">

      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reports
        </h1>

        <div className="flex items-center gap-4 text-sm">
          <a href="/" className="text-gray-500 hover:text-gray-900 transition">
            Dashboard
          </a>

          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/login'
            }}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT PANEL */}
        <div className="lg:col-span-1 space-y-6">

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-medium mb-4 text-gray-700">Report Type</h3>

            <div className="space-y-3">
              {Object.entries(reportTitles).map(([key, title]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="report"
                    value={key}
                    checked={reportType === key}
                    onChange={e => setReportType(e.target.value)}
                    className="accent-gray-900"
                  />
                  <span className="text-sm text-gray-600">{title}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-medium mb-4 text-gray-700">Date Range</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-200 outline-none"
                />
              </div>
            </div>

            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full mt-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

          {data && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-medium mb-3 text-gray-700">Export</h3>

              <div className="space-y-2">
                <button onClick={() => exportReport('xlsx')} className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm transition">
                  Export XLSX
                </button>
                <button onClick={() => exportReport('csv')} className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm transition">
                  Export CSV
                </button>
                <button onClick={() => exportReport('pdf')} className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm transition">
                  Export PDF
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-3 space-y-6">

          {summary && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-medium mb-4 text-gray-700">Summary</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(summary).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <div className="text-xs text-gray-500 capitalize">{key}</div>
                    <div className="text-sm font-semibold text-gray-800 mt-1">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-medium mb-4 text-gray-700">
                {reportTitles[reportType]} Data
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      {Object.keys(data[0] || {}).map(col => (
                        <th key={col} className="py-2 px-2 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50 transition">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="py-2 px-2 text-gray-700">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!data && !loading && (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500 shadow-sm">
              Select a report type and generate data to view analytics
            </div>
          )}

        </div>
      </div>
    </div>
  )
}