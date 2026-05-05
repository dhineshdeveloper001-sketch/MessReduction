import React, { useState, useEffect } from "react";
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
                className="font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-tight flex flex-wrap gap-[1px] justify-center sm:justify-start"
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
        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3.5 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200">
            <span className="text-teal-400/60 shrink-0">{icon}</span>
            <Component
                className="flex-1 bg-transparent focus:outline-none text-base text-white placeholder:text-white/25 font-medium appearance-none w-full"
                {...props}
            >
                {children}
            </Component>
        </div>
    )
}

function MessReductionPage() {
    const [formData, setFormData] = useState({
        name: "",
        id: "",
        room: "",
        dept: "",
        year: "",
        mobile: "",
        leaveDate: "",
        leaveTime: "",
        arrivalDate: "",
        arrivalTime: "",
        totalHolidays: "",
        reason: "",
        otherReason: ""
    });

    const [status , setStatus] = useState("pending")
    const [isSubmitted, setIssubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [myRequests, setMyRequests] = useState([])

    useEffect(() => {
        const savedUser = sessionStorage.getItem("currentUser");
        if (savedUser) {
            const user = JSON.parse(savedUser);
            const studentId = user.id;
            if (studentId) fetchStudentData(studentId);
        }
    }, []);

    const fetchStudentData = async (studentId) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`http://localhost:8081/api/student-form/StudentForm/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch");
            const student = await response.json();
            setFormData(prev => ({
                ...prev,
                name: student.name || "",
                dept: student.department || "",
            }));
            fetchMyRequests(studentId);
        } catch (e) {
            console.error("Failed to load student data:", e);
        }
    };
    const fetchMyRequests = async (studentId) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`http://localhost:8081/api/student-form/StudentForm/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const forms = await response.json();
                setMyRequests(Array.isArray(forms) ? forms : []);
            }
        } catch (e) {
            console.error("Failed to load requests:", e);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const savedUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
        const studentId = savedUser.id;
        const token = sessionStorage.getItem("token");

        // Build DTO matching backend ReductionFormReqDTO
        const submissionData = {
            year: parseInt(formData.year),
            roomNo: parseInt(formData.room) || 0,
            leaveDate: formData.leaveDate,
            leaveTime: formData.leaveTime + ":00",
            arrivalDate: formData.arrivalDate,
            arrivalTime: formData.arrivalTime + ":00",
            reason: formData.reason === "other" ? formData.otherReason : formData.reason,
        };

        try {
            const response = await fetch(`http://localhost:8081/api/student-form/StudentForm/${studentId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(submissionData)
            });

            if (response.ok) {
                setIssubmitted(true);
                fetchMyRequests(studentId);
            } else {
                const msg = await response.text();
                alert("Submission failed: " + msg);
            }
        } catch (error) {
            alert("Error submitting form: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
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
                <div style={{ perspective: "1200px" }} className="w-full max-w-[950px] shrink-0">
                    <motion.div
                        initial={{ opacity: 0, rotateY: -10, y: 20 }}
                        animate={{ opacity: 1, rotateY: 0, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        style={{ transformStyle: "preserve-3d" }}
                        className="w-full"
                    >
                        <div className="w-full rounded-2xl border border-white/8 bg-[#0f1f38] shadow-xl overflow-hidden">
                            <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />
                            <div className="p-8 sm:p-12 lg:p-16">
                                <AnimatedTitle />

                                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Field icon={<FiUser size={15} />} type="text" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                                        <Field icon={<FiCreditCard size={15} />} type="text" placeholder="Reg No" name="id" value={formData.id} onChange={handleChange} required />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Field icon={<FiHome size={15} />} type="text" placeholder="Room No" name="room" value={formData.room} onChange={handleChange} />
                                        <Field icon={<FiBookOpen size={15} />} type="text" placeholder="Branch (e.g. CSE)" name="dept" value={formData.dept} onChange={handleChange} required />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200 relative">
                                            <span className="text-teal-400/60 shrink-0"><FiCalendar size={15} /></span>
                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleChange}
                                                required
                                                className="flex-1 bg-transparent focus:outline-none text-sm text-white font-medium appearance-none w-full"
                                            >
                                                <option value="" disabled className="text-white/40 bg-[#0f1f38]">Select Year</option>
                                                {["1st", "2nd", "3rd", "4th"].map(y => (
                                                    <option key={y} value={y} className="bg-[#0f1f38] text-white">{y} Year</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                                <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                        <Field icon={<FiPhone size={15} />} type="tel" placeholder="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Field
                                            icon={<FiCalendar size={15} />}
                                            type="text"
                                            placeholder="Leave Date"
                                            name="leaveDate"
                                            value={formData.leaveDate}
                                            onChange={handleChange}
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                            required
                                        />
                                        <Field
                                            icon={<FiClock size={15} />}
                                            type="text"
                                            placeholder="Leave Time"
                                            name="leaveTime"
                                            value={formData.leaveTime}
                                            onChange={handleChange}
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
                                            name="arrivalDate"
                                            value={formData.arrivalDate}
                                            onChange={handleChange}
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                            required
                                        />
                                        <Field
                                            icon={<FiClock size={15} />}
                                            type="text"
                                            placeholder="Arrival Time"
                                            name="arrivalTime"
                                            value={formData.arrivalTime}
                                            onChange={handleChange}
                                            onFocus={(e) => (e.target.type = "time")}
                                            onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <Field icon={<FiFileText size={15} />} type="number" placeholder="No. of Holidays" name="totalHolidays" value={formData.totalHolidays} onChange={handleChange} required />

                                        {/* Select Field */}
                                        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200 relative">
                                            <span className="text-teal-400/60 shrink-0"><FiInfo size={15} /></span>
                                            <select
                                                name="reason"
                                                value={formData.reason}
                                                onChange={handleChange}
                                                className="flex-1 bg-transparent focus:outline-none text-sm text-white font-medium appearance-none w-full"
                                                required
                                            >
                                                <option value="" disabled className="text-white/40 bg-[#0f1f38]">Select Reason</option>
                                                <option value="Study Holidays" className="bg-[#0f1f38]">Study Holidays</option>
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
                                        {formData.reason === "other" && (
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
                                                    name="otherReason"
                                                    value={formData.otherReason}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        whileHover={{ scale: 1.015 }}
                                        whileTap={{ scale: 0.985 }}
                                        className={`mt-4 flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-bold text-slate-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:brightness-110 shadow-lg shadow-teal-900/30 transition-all duration-200 tracking-wider ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "SUBMITTING..." : "SUBMIT FORM"} <FiArrowRight size={14} />
                                    </motion.button>
                                </form>
                            </div>
                        </div>

                        <div className="w-full rounded-2xl border border-white/8 bg-[#0f1f38] shadow-xl overflow-hidden mt-8">
                            <div className="p-5 sm:p-8 md:p-12 lg:p-16">
                                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">MY APPLICATIONS</h3>
                                    <div className="flex-1 h-px bg-white/5" />
                                </div>
                                <div className="space-y-4">
                                     {myRequests.length > 0 ? myRequests.map(req => (
                                        <div key={req.id} className="bg-white/5 rounded-2xl p-5 border border-white/5 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">{req.leaveDate} to {req.arrivalDate}</p>
                                                <p className="text-sm font-medium text-white">{req.reason}</p>
                                            </div>
                                            <div className="flex items-center gap-3 text-right">
                                                 <div>
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Status</p>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                                                        req.status === 'fully_approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        req.status === 'final_rejected' || req.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                        {req.status === 'pending' ? 'Auth: Deputy Warden' :
                                                         req.status === 'accepted' ? 'Auth: Chief Warden' :
                                                         req.status === 'approved_by_warden' ? 'Auth: Hostel Office' :
                                                         req.status === 'fully_approved' ? 'FULLY ACCEPTED' : req.status}
                                                    </span>
                                                 </div>
                                            </div>
                                        </div>
                                     )) : (
                                        <div className="text-center py-5 text-white/20 text-xs font-medium italic">No applications found.</div>
                                     )}
                                </div>
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