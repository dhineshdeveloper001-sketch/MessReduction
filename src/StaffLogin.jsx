import React, { useState } from "react"
import { motion } from "framer-motion"
import { FiUser, FiLock, FiArrowRight, FiShield } from "react-icons/fi"
import image from "./assets/1000088399.png"

const TITLE = "STAFF LOGIN"

const getInitial = () => {
  const sides = ['top', 'bottom', 'left', 'right']
  const side = sides[Math.floor(Math.random() * sides.length)]
  const d = 250, v = Math.floor(Math.random() * 60) - 30
  const r = Math.floor(Math.random() * 240) - 120
  const pos = { top: [v, -d], bottom: [v, d], left: [-d, v], right: [d, v] }[side]
  return { x: pos[0], y: pos[1], rotate: r, opacity: 0, scale: 0.5 }
}

function Field({ icon, ...props }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200">
      <span className="text-teal-400/60 shrink-0">{icon}</span>
      <input className="flex-1 bg-transparent focus:outline-none text-sm text-white placeholder:text-white/25 font-medium" {...props} />
    </div>
  )
}

const ROLE_ROUTES = {
  Warden: '/warden/1st',
  DeputyWarden: '/deputy',
  Office: '/office',
}

function StaffLogin() {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8081/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, userName, password })
      })

      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || "Invalid credentials")
      }

      const data = await response.json()

      // Store staff JWT token and info
      sessionStorage.setItem("staffToken", data.token)
      sessionStorage.setItem("staffUser", JSON.stringify({
        username: data.username,
        role: data.role
      }))

      // Navigate to the correct page based on role
      const route = ROLE_ROUTES[data.role] || '/'
      window.location.href = route

    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans selection:bg-teal-500/30 relative">
      {/* Background */}
      <div className="fixed inset-0 bg-[#0a1628] -z-10" />

      {/* Header */}
      <header className="w-full flex items-center justify-center gap-3 px-4 sm:px-5 py-2.5 sm:py-4 border-b border-white/5 bg-[#0a1628]/80 backdrop-blur-sm shrink-0">
        <img src={image} alt="GCES Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-teal-400/80 uppercase">
            Government College of Engineering
          </span>
          <span className="text-base sm:text-lg font-black text-white tracking-widest">
            SRIRANGAM
          </span>
        </div>
      </header>

      <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent shrink-0" />

      {/* Main */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 py-8">
        <div style={{ perspective: "1200px" }} className="w-full max-w-[420px]">
          <motion.div
            initial={{ opacity: 0, rotateY: -70, scale: 0.95 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-full"
          >
            <div className="w-full rounded-2xl border border-white/8 bg-[#0f1f38] shadow-xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
              <div className="p-6 sm:p-8">
                {/* Title */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1.5">
                    <FiShield className="text-amber-400/70" size={12} />
                    <p className="text-[10px] font-semibold tracking-[0.3em] text-amber-400/70 uppercase">
                      Restricted Access
                    </p>
                  </div>
                  <motion.h2
                    className="font-black text-3xl text-white tracking-tight flex gap-[1px]"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
                  >
                    {TITLE.split("").map((char, i) => (
                      <motion.span
                        key={i}
                        className="inline-block cursor-default"
                        variants={{
                          hidden: char === " " ? { opacity: 0 } : getInitial(),
                          visible: char === " "
                            ? { opacity: 1, width: '0.3em' }
                            : { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 22 } },
                        }}
                        whileHover={char !== " " ? { scale: 1.15, color: "#fbbf24" } : {}}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.h2>
                  <p className="text-xs text-white/30 mt-1 font-medium">Sign in with your staff credentials</p>
                  <div className="mt-4 h-px bg-gradient-to-r from-amber-500/40 to-transparent" />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* Role selector */}
                  <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 focus-within:border-amber-500/60 focus-within:bg-amber-950/20 transition-colors duration-200">
                    <span className="text-amber-400/60 shrink-0"><FiShield size={15} /></span>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      className="flex-1 bg-transparent focus:outline-none text-sm text-white placeholder:text-white/25 font-medium appearance-none"
                    >
                      <option value="" className="bg-[#0f1f38] text-white/40">Select Role</option>
                      <option value="Warden" className="bg-[#0f1f38] text-white">Warden</option>
                      <option value="DeputyWarden" className="bg-[#0f1f38] text-white">Deputy Warden</option>
                      <option value="Office" className="bg-[#0f1f38] text-white">Hostel Office</option>
                    </select>
                  </div>

                  <Field
                    icon={<FiUser size={15} />}
                    type="text"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />

                  <Field
                    icon={<FiLock size={15} />}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  {error && (
                    <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 font-medium">
                      {error}
                    </p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={loading}
                    className={`mt-2 flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 shadow-lg shadow-amber-900/30 transition-all duration-200 tracking-wider ${loading ? "opacity-50" : ""}`}
                  >
                    {loading ? "AUTHENTICATING..." : "SIGN IN"} <FiArrowRight size={14} />
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="shrink-0 pb-4 text-center">
        <p className="text-[10px] text-white/15 tracking-widest uppercase">
          © 2025 GCES · Staff Portal · Authorized Access Only
        </p>
      </footer>
    </div>
  )
}

export default StaffLogin
