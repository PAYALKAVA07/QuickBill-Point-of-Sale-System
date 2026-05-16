// import React, { useState } from 'react'
// import axios from 'axios'

// export default function Login(){
//   const [email,setEmail]=useState('');
//   const [password,setPassword]=useState('');
//   const [err,setErr]=useState('');

//   const submit = async (e) =>{
//     e.preventDefault();
//     try{
//       const res = await axios.post(import.meta.env.VITE_API_URL + '/auth/login', { email, password });
//       localStorage.setItem('token', res.data.token);
//       window.location.href = '/';
//     }catch(err){ setErr(err.response?.data?.message || 'Login failed'); }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form onSubmit={submit} className="p-8 bg-white rounded shadow w-full max-w-md">
//         <h2 className="text-2xl mb-4">QuickBill Login</h2>
//         {err && <div className="text-red-600">{err}</div>}
//         <input className="border p-2 w-full mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
//         <input type="password" className="border p-2 w-full mb-3" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
//         <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign in</button>
//       </form>
//     </div>
//   )
// }


import React, { useState } from 'react'
import axios from 'axios'
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/auth/login',
        { email, password }
      )

      localStorage.setItem('token', res.data.token)
      window.location.href = '/'
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f6f7fb] relative overflow-hidden">

      {/* soft aesthetic blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-100px] w-[320px] h-[320px] bg-indigo-200/40 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-140px] right-[-120px] w-[380px] h-[380px] bg-rose-200/40 blur-[140px] rounded-full"></div>
      </div>

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8"
      >
        {/* icon */}
        <div className="flex justify-center mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-100 to-rose-100 border border-gray-200">
            <Sparkles className="text-indigo-500" size={26} />
          </div>
        </div>

        {/* heading */}
        <h2 className="text-3xl font-semibold text-center text-gray-900">
          Welcome back
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Sign in to continue to your workspace
        </p>

        {/* error */}
        {err && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {err}
          </div>
        )}

        {/* email */}
        <div className="mb-5">
          <label className="text-sm text-gray-600 mb-2 block">
            Email
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* password */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 mb-2 block">
            Password
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full pl-11 pr-12 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* button */}
        <button className="w-full py-3 rounded-2xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition shadow-md">
          Sign in
        </button>

        {/* footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secure access to your account
        </p>
      </form>
    </div>
  )
}
