import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import store from './store'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import OrderView from './pages/OrderView'
import POS from './pages/POS'
import Reports from './pages/Reports'

function PrivateRoute({ children }){
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
          <Route path="/pos" element={<PrivateRoute><POS/></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><OrderView/></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports/></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
