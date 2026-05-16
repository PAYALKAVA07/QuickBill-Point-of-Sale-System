// import React, { useEffect, useState } from 'react'
// import StatCard from '../components/StatCard'
// import DailySalesChart from '../components/DailySalesChart'
// import TopProductsChart from '../components/TopProductsChart'
// import CategoryBreakdownChart from '../components/CategoryBreakdownChart'
// import api from '../utils/api'

// export default function Dashboard(){
//   const [kpis, setKpis] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchKPIs()
//   }, [])

//   const fetchKPIs = async () => {
//     try {
//       const res = await api.get('/dashboard/kpis')
//       setKpis(res.data)
//     } catch (err) {
//       console.error('Failed to fetch KPIs:', err)
//     }
//     setLoading(false)
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold">Dashboard</h1>
//         <div>
//           <a href="/pos" className="mr-2 px-3 py-1 bg-green-600 text-white rounded">Open POS</a>
//           <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login' }} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
//         </div>
//       </header>

//       {loading ? (
//         <div className="text-center py-8">Loading dashboard...</div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//             <StatCard title="Today's Sales" value={`₹${kpis?.todayRevenue || 0}`} icon="📊" color="blue" />
//             <StatCard title="Monthly Revenue" value={`₹${kpis?.monthRevenue || 0}`} icon="📈" color="green" />
//             <StatCard title="Total Orders" value={kpis?.totalOrders || 0} icon="📦" color="purple" />
//             <StatCard title="Products" value={kpis?.totalProducts || 0} icon="🏷️" color="purple" />
//             <StatCard title="Low Stock" value={kpis?.lowStockCount || 0} icon="⚠️" color="red" />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//             <DailySalesChart />
//             <CategoryBreakdownChart />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <TopProductsChart />
//             <RecentTransactions />
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// function RecentTransactions(){
//   const [transactions, setTransactions] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchTransactions()
//   }, [])

//   const fetchTransactions = async () => {
//     try {
//       const res = await api.get('/dashboard/recent-transactions')
//       setTransactions(res.data)
//     } catch (err) {
//       console.error('Failed to fetch transactions:', err)
//     }
//     setLoading(false)
//   }

//   if (loading) return <div className="p-4 bg-white rounded shadow">Loading...</div>

//   return (
//     <div className="p-4 bg-white rounded shadow">
//       <h3 className="font-semibold mb-4">Recent Transactions</h3>
//       <div className="space-y-2">
//         {transactions.map(t => (
//           <div key={t.id} className="flex items-center justify-between p-2 border-b">
//             <div>
//               <div className="font-medium">{t.invoiceNumber}</div>
//               <div className="text-xs text-gray-500">{t.date}</div>
//             </div>
//             <div className="text-right">
//               <div className="font-medium">₹{t.total}</div>
//               <div className="text-xs text-gray-500">{t.paymentMethod}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DailySalesChart from '../components/DailySalesChart'
import TopProductsChart from '../components/TopProductsChart'
import CategoryBreakdownChart from '../components/CategoryBreakdownChart'
import api from '../utils/api'

export default function Dashboard() {
  const [kpis, setKpis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(false) // UI only

  useEffect(() => {
    fetchKPIs()
  }, [])

  const fetchKPIs = async () => {
    try {
      const res = await api.get('/dashboard/kpis')
      setKpis(res.data)
    } catch (err) {
      console.error('Failed to fetch KPIs:', err)
    }
    setLoading(false)
  }

  const bg = dark ? 'bg-[#0b0f19] text-white' : 'bg-[#f5f7fb] text-gray-800'
  const card = dark
    ? 'bg-white/5 border-white/10 text-white'
    : 'bg-white border-gray-200 text-gray-800'

  return (
    <div className={`min-h-screen transition-colors duration-300 p-6 ${bg}`}>

      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <div className="flex items-center gap-3 text-sm">

          {/* Theme toggle (UI only) */}
          <button
            onClick={() => setDark(!dark)}
            className={`px-3 py-2 rounded-xl border transition ${
              dark
                ? 'bg-white/10 border-white/10'
                : 'bg-white border-gray-200'
            }`}
          >
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <a
            href="/pos"
            className={`px-4 py-2 rounded-xl transition ${
              dark
                ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            Open POS
          </a>

          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/login'
            }}
            className={`px-4 py-2 rounded-xl transition ${
              dark
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Logout
          </button>
        </div>
      </header>

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-gray-200/60"
            />
          ))}
        </div>
      ) : (
        <>
          {/* KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
            <StatCard title="Today's Sales" value={`₹${kpis?.todayRevenue || 0}`} icon="📊" color="blue" />
            <StatCard title="Monthly Revenue" value={`₹${kpis?.monthRevenue || 0}`} icon="📈" color="green" />
            <StatCard title="Total Orders" value={kpis?.totalOrders || 0} icon="📦" color="purple" />
            <StatCard title="Products" value={kpis?.totalProducts || 0} icon="🏷️" color="purple" />
            <StatCard title="Low Stock" value={kpis?.lowStockCount || 0} icon="⚠️" color="red" />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className={`${card} border rounded-2xl p-5 shadow-sm`}>
              <DailySalesChart />
            </div>

            <div className={`${card} border rounded-2xl p-5 shadow-sm`}>
              <CategoryBreakdownChart />
            </div>
          </div>

          {/* LOWER SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${card} border rounded-2xl p-5 shadow-sm`}>
              <TopProductsChart />
            </div>

            <RecentTransactions dark={dark} />
          </div>
        </>
      )}
    </div>
  )
}

/* -------------------- RECENT TRANSACTIONS -------------------- */

function RecentTransactions({ dark }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/dashboard/recent-transactions')
      setTransactions(res.data)
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className={`border rounded-2xl p-5 ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="h-4 w-40 bg-gray-300/40 rounded mb-4 animate-pulse" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200/40 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-2xl p-5 shadow-sm ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <h3 className="font-medium mb-4">Recent Transactions</h3>

      <div className="space-y-3">
        {transactions.map(t => (
          <div
            key={t.id}
            className={`flex items-center justify-between p-3 rounded-xl transition hover:bg-black/5 ${
              dark ? 'hover:bg-white/10' : ''
            }`}
          >
            <div>
              <div className="font-medium">{t.invoiceNumber}</div>
              <div className="text-xs opacity-60">{t.date}</div>
            </div>

            <div className="text-right">
              <div className="font-semibold">₹{t.total}</div>
              <div className="text-xs opacity-60">{t.paymentMethod}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}