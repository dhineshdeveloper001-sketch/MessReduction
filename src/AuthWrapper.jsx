import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Login from "./Login"
import Register from "./Register"
import image from "./assets/1000088399.png"

function AuthWrapper() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-[100dvh] w-full flex flex-col md:flex-row relative bg-[#020c18] font-sans selection:bg-teal-500/30 overflow-hidden">

      {/* ── Animated Background Layer ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Deep radial base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(13,75,70,0.4),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,rgba(29,50,100,0.3),transparent_70%)]" />

        {/* Animated orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-teal-600/25 rounded-full mix-blend-screen filter blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-indigo-700/20 rounded-full mix-blend-screen filter blur-[140px]"
        />
        <motion.div
          animate={{ y: [0, -40, 0], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full mix-blend-screen filter blur-[100px]"
        />

        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* ═══════════════════════════════════════════════
          LEFT BRANDING PANEL — desktop only (md+)
      ═══════════════════════════════════════════════ */}
      <div className="hidden md:flex md:w-[42%] lg:w-[45%] flex-col items-center justify-center relative z-10 p-10 lg:p-16">
        {/* Decorative vertical rule */}
        <div className="absolute right-0 top-[10%] h-[80%] w-px bg-gradient-to-b from-transparent via-teal-500/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-center text-center gap-6"
        >
          {/* Crest ring */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-36 h-36 rounded-full border border-teal-500/15 border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-28 h-28 rounded-full border border-teal-400/10 border-dashed"
            />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-teal-900/60 to-slate-900/80 border border-teal-500/30 shadow-[0_0_40px_rgba(20,184,166,0.15)] flex items-center justify-center p-2">
              <img src={image} alt="GCES Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* College name */}
          <div className="space-y-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-semibold tracking-[0.35em] text-teal-400/70 uppercase"
            >
              Government College of Engineering
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-teal-200"
            >
              SRIRANGAM
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"
            />
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-teal-100/40 leading-relaxed max-w-xs font-medium tracking-wide"
          >
            Mess Reduction Portal — Streamlining college meal management with precision and transparency.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-8 mt-2"
          >
            {[["Secure", "Access"], ["Digital", "Records"], ["Real-time", "Tracking"]].map(([l1, l2], i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400/60" />
                <span className="text-[10px] font-semibold text-teal-300/50 tracking-widest uppercase leading-tight text-center">{l1}<br/>{l2}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          RIGHT FORM PANEL — always visible
      ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-h-[100dvh] md:min-h-0 z-10 relative">

        {/* Mobile-only compact header */}
        <div className="flex md:hidden items-center gap-3 px-5 pt-5 pb-3 shrink-0">
          <img src={image} alt="logo" className="w-9 h-9 object-contain" />
          <div>
            <p className="text-[9px] font-bold tracking-[0.2em] text-teal-400/70 uppercase leading-none">Government College of Engineering</p>
            <p className="text-sm font-black text-white tracking-wider leading-tight">SRIRANGAM</p>
          </div>
        </div>

        {/* Divider line mobile */}
        <div className="md:hidden h-px mx-5 bg-gradient-to-r from-transparent via-teal-500/25 to-transparent shrink-0" />

        {/* Form area — centers vertically on desktop, fills on mobile */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
          <div style={{ perspective: "1500px" }} className="w-full max-w-[420px]">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, rotateY: -90, scale: 0.92 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: 90, scale: 0.92 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative w-full border border-white/8 bg-gradient-to-br from-slate-900/90 via-teal-950/70 to-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
                    {/* Top accent bar */}
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
                    <div className="p-6 sm:p-8">
                      <Login goToRegister={() => setIsLogin(false)} />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, rotateY: 90, scale: 0.92 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -90, scale: 0.92 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative w-full border border-white/8 bg-gradient-to-br from-slate-900/90 via-teal-950/70 to-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
                    {/* Top accent bar */}
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
                    <div className="p-5 sm:p-7">
                      <Register goToLogin={() => setIsLogin(true)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 pb-4 text-center">
          <p className="text-[10px] text-teal-100/20 tracking-widest uppercase">© 2025 GCES · Mess Reduction Portal</p>
        </div>
      </div>
    </div>
  )
}

export default AuthWrapper