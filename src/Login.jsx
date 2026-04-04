import { motion } from "framer-motion"
import { FiUser, FiHash, FiArrowRight } from "react-icons/fi"

const TITLE = "LOGIN"

const getInitial = () => {
  const sides = ['top', 'bottom', 'left', 'right']
  const side = sides[Math.floor(Math.random() * sides.length)]
  const d = 250, v = Math.floor(Math.random() * 60) - 30
  const r = Math.floor(Math.random() * 240) - 120
  const pos = { top: [v,-d], bottom: [v,d], left: [-d,v], right: [d,v] }[side]
  return { x: pos[0], y: pos[1], rotate: r, opacity: 0, scale: 0.5 }
}

function AnimatedTitle() {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-semibold tracking-[0.3em] text-teal-400/70 uppercase mb-1.5">
        Student Portal
      </p>
      <motion.h2
        className="font-black text-3xl text-white tracking-tight flex gap-[1px]"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
      >
        {TITLE.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block cursor-default"
            variants={{
              hidden: getInitial(),
              visible: { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0,
                transition: { type: "spring", stiffness: 200, damping: 22 } },
            }}
            whileHover={{ scale: 1.15, color: "#2dd4bf" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h2>
      <p className="text-xs text-white/30 mt-1 font-medium">Sign in to your mess account</p>
      <div className="mt-4 h-px bg-gradient-to-r from-teal-500/40 to-transparent" />
    </div>
  )
}

function Field({ icon, ...props }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200">
      <span className="text-teal-400/60 shrink-0">{icon}</span>
      <input className="flex-1 bg-transparent focus:outline-none text-sm text-white placeholder:text-white/25 font-medium" {...props} />
    </div>
  )
}

function Login({ goToRegister }) {
  return (
    <div className="flex flex-col gap-3">
      <AnimatedTitle />

      <Field
        icon={<FiUser size={15} />}
        type="text" inputMode="numeric" pattern="[0-9]*"
        placeholder="Register number"
        onKeyDown={(e) => {
          if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key))
            e.preventDefault()
        }}
      />
      <Field
        icon={<FiHash size={15} />}
        type="text" inputMode="text" pattern="[a-zA-Z0-9]*"
        placeholder="Roll number"
        onKeyDown={(e) => {
          if (!/[a-zA-Z0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key))
            e.preventDefault()
        }}
        onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "") }}
      />

      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold text-slate-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:brightness-110 shadow-lg shadow-teal-900/30 transition-all duration-200 tracking-wider"
      >
        SIGN IN <FiArrowRight size={14} />
      </motion.button>

      <p className="text-center text-xs mt-1 text-white/30">
        New student?{" "}
        <button onClick={goToRegister} className="text-teal-400 font-semibold hover:text-teal-300 underline underline-offset-2 transition-colors">
          Create account
        </button>
      </p>
    </div>
  )
}

export default Login