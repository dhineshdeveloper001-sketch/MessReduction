import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiHome, FiCreditCard, FiBookOpen, FiCalendar, FiClock, FiPhone, FiInfo, FiArrowRight, FiFileText } from "react-icons/fi";
import image from "./assets/1000088399.png";

const TITLE = "MESS REDUCTION";

const getInitial = () => {
    const sides = ['top', 'bottom', 'left', 'right']
    const side = sides[Math.floor(Math.random() * sides.length)]
    const d = 250, v = Math.floor(Math.random() * 60) - 30
    const r = Math.floor(Math.random() * 240) - 120
    const pos = { top: [v, -d], bottom: [v, d], left: [-d, v], right: [d, v] }[side]
    return { x: pos[0], y: pos[1], rotate: r, opacity: 0, scale: 0.5 }
}

function AnimatedTitle() {
    return (
        <div className="mb-6 text-center sm:text-left">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-teal-400/70 uppercase mb-1.5">
                Hostel Application
            </p>
            <motion.h2
                className="font-black text-2xl sm:text-3xl text-white tracking-tight flex flex-wrap gap-[1px] justify-center sm:justify-start"
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
                            visible: char === " " ? { opacity: 1, width: '0.3em' } : {
                                opacity: 1, scale: 1, x: 0, y: 0, rotate: 0,
                                transition: { type: "spring", stiffness: 200, damping: 22 }
                            },
                        }}
                        whileHover={char !== " " ? { scale: 1.15, color: "#2dd4bf" } : {}}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.h2>
            <p className="text-xs text-white/30 mt-1 font-medium">Submit your leave request details below</p>
            <div className="mt-4 h-[2px] bg-gradient-to-r from-teal-500/40 via-teal-500/10 to-transparent" />
        </div>
    )
}

function Field({ icon, as: Component = "input", children, ...props }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200">
            <span className="text-teal-400/60 shrink-0">{icon}</span>
            <Component
                className="flex-1 bg-transparent focus:outline-none text-sm text-white placeholder:text-white/25 font-medium appearance-none w-full"
                {...props}
            >
                {children}
            </Component>
        </div>
    )
}

function MessReductionPage() {
    const [reason, setReason] = useState("");
    const [otherText, setOtherText] = useState("");
    const [status , setStatus] = useState("pending")
    const [isSubmitted, setIssubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();

        if (reason === "other") {
            console.log("Other Reason:", otherText);
        } else {
            console.log("Selected Reason:", reason);
        }
        setIssubmitted(true)

    };
    return (
        <div className="h-[100dvh] w-full flex flex-col font-sans selection:bg-teal-500/30 relative">
            {/* Full-page background */}
            <div className="fixed inset-0 bg-[#0a1628] -z-10" />

            {/* ── Header ── */}
            <header className="w-full flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-4 border-b border-white/5 bg-[#0a1628]/80 backdrop-blur-sm shrink-0">
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

            {/* ── Status Indicator ── */}
            <div className="absolute top-[72px] sm:top-[88px] left-1/2 -translate-x-1/2 z-20 w-max pointer-events-none">
                <AnimatePresence>
                    {isSubmitted && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/15 bg-[#0f1f38]/90 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center gap-3 sm:gap-4 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/15 to-transparent animate-pulse" />
                            
                            <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-[0_0_12px_currentcolor] shrink-0 ${
                                status === "accepted" ? "bg-emerald-400 text-emerald-400" :
                                status === "pending" ? "bg-amber-400 text-amber-400" :
                                "bg-rose-400 text-rose-400"
                            }`} />

                            <span className="text-[10px] sm:text-sm font-bold tracking-widest sm:tracking-[0.2em] text-white uppercase flex items-center gap-2 sm:gap-3">
                                <span className="opacity-40">Status:</span>
                                <span className={
                                    status === "accepted" ? "text-emerald-400" :
                                    status === "pending" ? "text-amber-400" :
                                    "text-rose-400"
                                }>
                                    {status}
                                </span>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent shrink-0" />

            {/* ── Main content ── */}
            <main className="flex-1 overflow-y-auto flex flex-col items-center px-4 py-20 sm:py-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div style={{ perspective: "1200px" }} className="w-full max-w-[800px] shrink-0">
                    <motion.div
                        initial={{ opacity: 0, rotateY: -10, y: 20 }}
                        animate={{ opacity: 1, rotateY: 0, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        style={{ transformStyle: "preserve-3d" }}
                        className="w-full"
                    >
                        <div className="w-full rounded-2xl border border-white/8 bg-[#0f1f38] shadow-xl overflow-hidden">
                            <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />
                            <div className="p-6 sm:p-8">
                                <AnimatedTitle />

                                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Field icon={<FiUser size={15} />} type="text" placeholder="Full Name" required />
                                        <Field icon={<FiCreditCard size={15} />} type="text" placeholder="Reg No" required />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Field icon={<FiHome size={15} />} type="text" placeholder="Room No" />
                                        <Field icon={<FiBookOpen size={15} />} type="text" placeholder="Branch" required />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Field icon={<FiCalendar size={15} />} type="number" placeholder="Year" required />
                                        <Field icon={<FiPhone size={15} />} type="tel" placeholder="Mobile Number" required />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Field
                                            icon={<FiCalendar size={15} />}
                                            type="text"
                                            placeholder="Leave Date"
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                            required
                                        />
                                        <Field
                                            icon={<FiClock size={15} />}
                                            type="text"
                                            placeholder="Leave Time"
                                            onFocus={(e) => (e.target.type = "time")}
                                            onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Field
                                            icon={<FiCalendar size={15} />}
                                            type="text"
                                            placeholder="Arrival Date"
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                            required
                                        />
                                        <Field
                                            icon={<FiClock size={15} />}
                                            type="text"
                                            placeholder="Arrival Time"
                                            onFocus={(e) => (e.target.type = "time")}
                                            onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Field icon={<FiFileText size={15} />} type="number" placeholder="No. of Holidays" required />

                                        {/* Select Field */}
                                        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200 relative">
                                            <span className="text-teal-400/60 shrink-0"><FiInfo size={15} /></span>
                                            <select
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                className="flex-1 bg-transparent focus:outline-none text-sm text-white font-medium appearance-none w-full"
                                                required
                                            >
                                                <option value="" disabled className="text-white/40 bg-[#0f1f38]">Select Reason</option>
                                                <option value="study" className="bg-[#0f1f38]">Study Holidays</option>
                                                <option value="Medical Leave" className="bg-[#0f1f38]">Medical Leave</option>
                                                <option value="other" className="bg-[#0f1f38]">Other Reason</option>
                                            </select>
                                            {/* Custom dropdown arrow */}
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                                <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {reason === "other" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <Field
                                                    icon={<FiFileText size={15} />}
                                                    type="text"
                                                    placeholder="Enter your reason"
                                                    value={otherText}
                                                    onChange={(e) => setOtherText(e.target.value)}
                                                    required
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        whileHover={{ scale: 1.015 }}
                                        whileTap={{ scale: 0.985 }}
                                        className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-bold text-slate-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:brightness-110 shadow-lg shadow-teal-900/30 transition-all duration-200 tracking-wider"
                                        type="submit"
                                    >
                                        SUBMIT FORM <FiArrowRight size={14} />
                                    </motion.button>
                                </form>

                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="shrink-0 pb-4 pt-2 text-center">
                <p className="text-[10px] text-white/15 tracking-widest uppercase">
                    © 2025 GCES · Mess Reduction Portal
                </p>
            </footer>
        </div>
    );
}

export default MessReductionPage;