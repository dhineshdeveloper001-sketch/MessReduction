import { motion } from "framer-motion"
import { FiUser, FiCreditCard, FiHash, FiCalendar, FiBookOpen, FiMail, FiPhone, FiArrowRight } from "react-icons/fi"

const TITLE = "REGISTER"

const getInitial = () => {
  const sides = ['top', 'bottom', 'left', 'right']
  const side = sides[Math.floor(Math.random() * sides.length)]
  const d = 220, v = Math.floor(Math.random() * 60) - 30
  const r = Math.floor(Math.random() * 200) - 100
  const pos = { top: [v, -d], bottom: [v, d], left: [-d, v], right: [d, v] }[side]
  return { x: pos[0], y: pos[1], rotate: r, opacity: 0, scale: 0.5 }
}

function AnimatedTitle() {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-semibold tracking-[0.3em] text-teal-400/70 uppercase mb-1.5">
        Student Portal
      </p>
      <motion.h2
        className="font-black text-2xl sm:text-3xl text-white tracking-tight flex gap-[1px]"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.03 } } }}
      >
        {TITLE.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block cursor-default"
            variants={{
              hidden: getInitial(),
              visible: {
                opacity: 1, scale: 1, x: 0, y: 0, rotate: 0,
                transition: { type: "spring", stiffness: 200, damping: 22 }
              },
            }}
            whileHover={{ scale: 1.15, color: "#2dd4bf" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h2>
      <p className="text-xs text-white/30 mt-0.5 font-medium">Create your mess account</p>
      <div className="mt-2 h-px bg-gradient-to-r from-teal-500/40 to-transparent" />
    </div>
  )
}

function Field({ icon, className = "", children }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200 ${className}`}>
      <span className="text-teal-400/60 shrink-0 text-sm">{icon}</span>
      {children}
    </div>
  )
}

const inp = "flex-1 min-w-0 bg-transparent focus:outline-none text-[13px] text-white placeholder:text-white/25 font-medium"

const numKey = (e) => {
  if (!/[0-9]/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key))
    e.preventDefault()
}

const alphaNumKey = (e) => {
  if (!/[a-zA-Z0-9]/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key))
    e.preventDefault()
}

function Register({ goToLogin }) {
  return (
    <div className="flex flex-col">
      <AnimatedTitle />

      <div className="flex flex-col gap-1.5">

        <Field icon={<FiUser />}>
          <input type="text" placeholder="Full name" className={inp}
            onKeyDown={(e) => {
              if (!/[a-zA-Z. ]/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key))
                e.preventDefault()
            }}
            onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-Z. ]/g, "") }}
          />
        </Field>

        <Field icon={<FiCreditCard />}>
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Register number" className={inp} onKeyDown={numKey} />
        </Field>

        <Field icon={<FiHash />}>
          <input
            type="text"
            inputMode="text"
            pattern="[a-zA-Z0-9]*"
            placeholder="Roll number"
            className={inp}
            onKeyDown={alphaNumKey}
            onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "") }}
          />
        </Field>

        <Field icon={<FiCalendar />}>
          <input type="text" placeholder="Date of birth" className={inp}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
          />
        </Field>

        <Field icon={<FiBookOpen />}>
          <select className={`${inp} appearance-none cursor-pointer`}>
            <option value="" className="bg-[#0f1f38] text-white/40">Select Department</option>
            {["CSE", "ECE", "EEE", "CIVIL", "MECH", "MECHATRONICS"].map(d => (
              <option key={d} className="bg-[#0f1f38] text-white">{d}</option>
            ))}
          </select>
        </Field>

        <Field icon={<FiMail />}>
          <input type="email" placeholder="Email address" className={inp} />
        </Field>

        <Field icon={<FiPhone />}>
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Phone number" className={inp} onKeyDown={numKey} />
        </Field>
      </div>

      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-bold text-slate-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:brightness-110 shadow-lg shadow-teal-900/30 transition-all duration-200 tracking-wider"
      >
        CREATE ACCOUNT <FiArrowRight size={14} />
      </motion.button>

      <p className="text-center text-xs mt-2 text-white/30">
        Already have an account?{" "}
        <button onClick={goToLogin} className="text-teal-400 font-semibold hover:text-teal-300 underline underline-offset-2 transition-colors">
          Sign in
        </button>
      </p>
    </div>
  )
}

export default Register