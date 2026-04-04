import { motion } from "framer-motion"
import { FiUser, FiCreditCard, FiHash, FiCalendar, FiBookOpen, FiMail, FiPhone, FiArrowRight } from "react-icons/fi"

const text = "REGISTER"

const getFourSideTransform = () => {
  const sides = ['top', 'bottom', 'left', 'right']
  const side = sides[Math.floor(Math.random() * sides.length)]
  const distance = 280
  const variation = Math.floor(Math.random() * 80) - 40
  const randomRotate = Math.floor(Math.random() * 300) - 150
  let initialX = 0, initialY = 0
  switch (side) {
    case 'top':    initialX = variation; initialY = -distance; break
    case 'bottom': initialX = variation; initialY = distance;  break
    case 'left':   initialX = -distance; initialY = variation; break
    case 'right':  initialX = distance;  initialY = variation; break
  }
  return { x: initialX, y: initialY, rotate: randomRotate, opacity: 0, scale: 0.5, filter: "blur(10px)" }
}

function AnimatedTitle() {
  return (
    <div className="mb-4 sm:mb-5 flex flex-col items-start">
      <p className="text-[10px] font-semibold tracking-[0.3em] text-teal-400/60 uppercase mb-1.5">Student Portal</p>
      <motion.h2
        className="font-black text-2xl sm:text-3xl text-white tracking-tight flex gap-[2px]"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            className="inline-block cursor-default"
            variants={{
              hidden: getFourSideTransform(),
              visible: {
                opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)",
                transition: { type: "spring", stiffness: 180, damping: 20 }
              },
            }}
            whileHover={{ scale: 1.15, color: "#2dd4bf", textShadow: "0 0 20px rgba(45,212,191,0.7)" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h2>
      <p className="text-xs text-teal-100/40 mt-1 font-medium">Create your mess account</p>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-3 h-px w-full bg-gradient-to-r from-teal-500/40 via-teal-400/20 to-transparent origin-left"
      />
    </div>
  )
}

/* Shared input box */
function InputBox({ icon, className = "", children, ...props }) {
  return (
    <motion.div
      whileFocusWithin={{ scale: 1.01 }}
      className={`group flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 focus-within:border-teal-400/50 focus-within:bg-teal-950/30 transition-all duration-300 ${className}`}
    >
      <span className="text-teal-400/60 group-focus-within:text-teal-400 transition-colors duration-300 shrink-0 text-sm">
        {icon}
      </span>
      {children}
    </motion.div>
  )
}

const inputClass = "flex-1 min-w-0 bg-transparent focus:outline-none text-[13px] text-teal-50 placeholder:text-teal-100/30 font-medium"

function Register({ goToLogin }) {
  return (
    <div className="w-full flex flex-col">
      <AnimatedTitle />

      {/* 2-column grid on mobile, single col on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-2.5">

        {/* Name — full width */}
        <InputBox icon={<FiUser />} className="col-span-2 sm:col-span-1">
          <input
            type="text"
            placeholder="Full name"
            className={inputClass}
            onKeyDown={(e) => {
              if (!/[a-zA-Z. ]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key))
                e.preventDefault()
            }}
            onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-Z. ]/g, "") }}
          />
        </InputBox>

        {/* Register # */}
        <InputBox icon={<FiCreditCard />}>
          <input
            type="text" inputMode="numeric" pattern="[0-9]*"
            placeholder="Reg. number"
            className={inputClass}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key))
                e.preventDefault()
            }}
          />
        </InputBox>

        {/* Roll # */}
        <InputBox icon={<FiHash />}>
          <input
            type="text" inputMode="numeric" pattern="[0-9]*"
            placeholder="Roll number"
            className={inputClass}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key))
                e.preventDefault()
            }}
          />
        </InputBox>

        {/* DOB */}
        <InputBox icon={<FiCalendar />}>
          <input
            type="text"
            placeholder="Date of birth"
            className={inputClass}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
          />
        </InputBox>

        {/* Department */}
        <InputBox icon={<FiBookOpen />}>
          <select className={`${inputClass} appearance-none cursor-pointer`}>
            <option value="" className="bg-slate-900 text-teal-200/50">Department</option>
            {["CSE","ECE","EEE","CIVIL","MECH"].map(d => (
              <option key={d} className="bg-slate-900 text-teal-50">{d}</option>
            ))}
          </select>
        </InputBox>

        {/* Email — full width */}
        <InputBox icon={<FiMail />} className="col-span-2 sm:col-span-1">
          <input type="email" placeholder="Email address" className={inputClass} />
        </InputBox>

        {/* Phone — full width */}
        <InputBox icon={<FiPhone />} className="col-span-2 sm:col-span-1">
          <input
            type="text" inputMode="numeric" pattern="[0-9]*"
            placeholder="Phone number"
            className={inputClass}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key))
                e.preventDefault()
            }}
          />
        </InputBox>
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-lg shadow-teal-900/40 transition-all duration-300 tracking-wider"
      >
        CREATE ACCOUNT <FiArrowRight size={15} />
      </motion.button>

      <p className="text-center text-xs mt-4 text-teal-100/40 font-medium">
        Already have an account?{" "}
        <button
          onClick={goToLogin}
          className="text-teal-400 font-semibold hover:text-teal-300 underline underline-offset-2 transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}

export default Register