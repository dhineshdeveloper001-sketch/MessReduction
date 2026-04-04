import { motion } from "framer-motion"
import { FiUser, FiHash, FiArrowRight } from "react-icons/fi"

const text = "LOGIN"

const getFourSideTransform = () => {
  const sides = ['top', 'bottom', 'left', 'right']
  const side = sides[Math.floor(Math.random() * sides.length)]
  const distance = 300
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
    <div className="mb-6 flex flex-col items-start">
      <p className="text-[10px] font-semibold tracking-[0.3em] text-teal-400/60 uppercase mb-2">Student Portal</p>
      <motion.h2
        className="font-black text-3xl sm:text-4xl text-white tracking-tight flex gap-[2px]"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
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
      <p className="text-xs text-teal-100/40 mt-1.5 font-medium">Sign in to your mess account</p>
      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-4 h-px w-full bg-gradient-to-r from-teal-500/40 via-teal-400/20 to-transparent origin-left"
      />
    </div>
  )
}

function InputField({ icon, ...props }) {
  return (
    <motion.div
      whileFocusWithin={{ scale: 1.01 }}
      className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 focus-within:border-teal-400/50 focus-within:bg-teal-950/30 transition-all duration-300"
    >
      <span className="text-teal-400/60 group-focus-within:text-teal-400 transition-colors duration-300 shrink-0">
        {icon}
      </span>
      <input
        className="flex-1 bg-transparent focus:outline-none text-sm text-teal-50 placeholder:text-teal-100/30 font-medium"
        {...props}
      />
    </motion.div>
  )
}

function Login({ goToRegister }) {
  return (
    <div className="w-full flex flex-col">
      <AnimatedTitle />

      <div className="flex flex-col gap-3 mt-2">
        <InputField
          icon={<FiUser size={16} />}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Register number"
          onKeyDown={(e) => {
            if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key))
              e.preventDefault()
          }}
        />
        <InputField
          icon={<FiHash size={16} />}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Roll number"
          onKeyDown={(e) => {
            if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key))
              e.preventDefault()
          }}
        />
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-lg shadow-teal-900/40 transition-all duration-300 tracking-wider"
      >
        SIGN IN <FiArrowRight size={15} />
      </motion.button>

      <p className="text-center text-xs mt-5 text-teal-100/40 font-medium">
        New student?{" "}
        <button
          onClick={goToRegister}
          className="text-teal-400 font-semibold hover:text-teal-300 underline underline-offset-2 transition-colors"
        >
          Create account
        </button>
      </p>
    </div>
  )
}

export default Login