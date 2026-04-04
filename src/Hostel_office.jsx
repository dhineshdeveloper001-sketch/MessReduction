import image from './assets/1000088399.png'
import { motion } from "framer-motion"
const text = "OFFICE"

const directions = [
  { x: -60, y: 0 },
  { x: 60, y: 0 },
  { x: 0, y: -60 },
  { x: 0, y: 60 },
]

function RegistrationTitle() {
  return (
    <motion.h1
      className="font-extrabold text-center my-6 
                 text-xl sm:text-2xl md:text-3xl lg:text-4xl 
                 flex justify-center tracking-wide"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.06,
            delayChildren: 0.2,
          },
        },
      }}
    >
      {text.split("").map((char, index) => {
        const direction = directions[index % directions.length]

        return (
          <motion.span
            key={index}
            className="inline-block cursor-default"
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.6,
                filter: "blur(6px)",
                ...direction,
              },
              visible: {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  type: "spring",
                  stiffness: 140,
                  damping: 14,
                },
              },
            }}
            whileHover={{
              scale: 1.15,
              color: "#38bdf8",
              textShadow: "0px 0px 12px rgba(56,189,248,0.9)",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        )
      })}
    </motion.h1>
  )
}


function Hostel_office() {
  return (
    <>
      <div className="flex items-center gap-3 justify-center">
        <img
          src={image}
          alt="logo"
          className="w-12 h-12 md:w-20 md:h-20 lg:w-28 lg:h-28"
        />

        <h1 className="text-sm font-bold md:text-2xl lg:text-3xl text-center">
          GOVERNMENT COLLEGE OF ENGINEERING , SRIRANGAM
        </h1>
      </div>

      <RegistrationTitle />

      <div
        className="
          flex flex-col items-center
          w-full max-w-xs sm:max-w-sm md:max-w-md
          border border-purple-800
          bg-gradient-to-br from-purple-900 via-indigo-900 to-black
          p-4 sm:p-5 md:p-6
          mx-3 sm:mx-auto
          text-amber-50
          rounded-xl sm:rounded-2xl
          gap-2 sm:gap-3
          my-3
          transition-all duration-300 ease-out
          hover:scale-[1.03]
          hover:shadow-xl hover:shadow-purple-900
          active:scale-[0.98]
        "
      >
        <input className="bg-amber-50 rounded-2xl text-center p-2 w-full text-black" placeholder="Enter your id" inputMode="numeric" />
        <input className="bg-amber-50 rounded-2xl text-center p-2 w-full text-black" placeholder="Enter your username" />
        <input className="bg-amber-50 rounded-2xl text-center p-2 w-full text-black" placeholder="Enter your password" inputMode="numeric" />
        <input className="bg-amber-50 rounded-2xl text-center p-2 w-full text-black" placeholder="Enter your email" />
        <button className="bg-amber-50 rounded-2xl px-3 py-2 text-black font-semibold">
          Login
        </button>
      </div>
    </>
  )
}

export default Hostel_office
