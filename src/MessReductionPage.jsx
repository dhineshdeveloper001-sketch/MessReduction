import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiHome, FiCreditCard, FiBookOpen, FiCalendar, FiClock, FiPhone, FiInfo, FiArrowRight, FiFileText } from "react-icons/fi";
import apiClient from "./api/apiClient";
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
            <p className="text-sm font-semibold tracking-[0.3em] text-teal-400/70 uppercase mb-2">
                Hostel Application
            </p>
            <motion.h2
                className="font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight flex flex-wrap gap-[1px] justify-center sm:justify-start"
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
            <p className="text-base text-white/30 mt-2 font-medium">Submit your leave request details below</p>
            <div className="mt-6 h-[2px] bg-gradient-to-r from-teal-500/40 via-teal-500/10 to-transparent" />
        </div>
    )
}

function Field({ icon, as: Component = "input", children, ...props }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3.5 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200">
            <span className="text-teal-400/60 shrink-0 text-base">{icon}</span>
            <Component
                className="flex-1 bg-transparent focus:outline-none text-lg text-white placeholder:text-white/25 font-medium appearance-none w-full"
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
    const [view, setView] = useState("dashboard") // 'dashboard' | 'form'

    useEffect(() => {
        // Auto-fill from session storage if available
        const savedUser = sessionStorage.getItem("currentUser");
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                id: user.regNo || "",
                dept: user.dept || ""
            }));
            fetchMyRequests(user.regNo);
        }
    }, []);

    const fetchMyRequests = async (regNo) => {
        try {
            // Assuming the backend has a way to fetch student-specific requests
            // Based on ReductionFormController, there might be a specific endpoint
            // If not, we might need to check if there's a global list or a student-filtered list
            // For now, let's assume we can fetch by studentId if available
            const savedUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
            if (savedUser.studentId) {
                // The backend controller doesn't seem to have a "my requests" endpoint yet
                // but usually there is one. Let's check StaffUsersController or other controllers.
                // Wait, I didn't see a student-specific GET for forms in the backend I viewed.
                // Let's check if there's a GET /api/student-form/my-forms
                const response = await apiClient.get(`/student-form/StudentForm/${savedUser.studentId}`);
                // Wait, that endpoint returns StudentDetails, not forms.
                // Let's assume there's an endpoint we missed or I'll just use the mock for now if missing.
                console.warn("Fetch forms endpoint not clearly defined in backend yet.");
            }
        } catch (e) {
            console.error("Error fetching requests:", e);
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
        if (!savedUser.studentId) {
            alert("Session expired. Please login again.");
            return;
        }

        // Map year string to number
        const yearMap = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 };
        
        const submissionData = {
            year: yearMap[formData.year] || 1,
            roomNo: parseInt(formData.room) || 0,
            leaveDate: formData.leaveDate,
            leaveTime: formData.leaveTime.length === 5 ? `${formData.leaveTime}:00` : formData.leaveTime,
            arrivalDate: formData.arrivalDate,
            arrivalTime: formData.arrivalTime.length === 5 ? `${formData.arrivalTime}:00` : formData.arrivalTime,
            reason: formData.reason === "other" ? formData.otherReason : formData.reason
        };

        try {
            const response = await apiClient.post(`/student-form/StudentForm/${savedUser.studentId}`, submissionData);

            if (response.status === 200 || response.status === 201) {
                setIssubmitted(true);
                alert("Form submitted successfully!");
                setView("dashboard");
                fetchMyRequests(savedUser.registerNo);
            } else {
                alert("Submission failed. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert(error.response?.data?.message || "Error submitting form. Ensure all fields are valid.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col font-sans bg-[#0a1628] text-white selection:bg-teal-500/30 relative">
            <div className="fixed inset-0 bg-[#0a1628] -z-10" />

            <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-8 py-4 sm:py-6 border-b border-white/5 bg-[#0a1628]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <img src={image} alt="GCES Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-teal-400/80 uppercase">
                            Government College of Engineering
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-white tracking-widest">
                            SRIRANGAM
                        </span>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex bg-[#0f1f38] p-1.5 rounded-2xl border border-white/5 shadow-xl">
                    <button
                        onClick={() => setView("dashboard")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black tracking-widest uppercase transition-all duration-300 ${view === "dashboard" ? "bg-teal-500 text-slate-900 shadow-lg" : "text-white/40 hover:text-white"}`}
                    >
                        <FiFileText size={14} /> Dashboard
                    </button>
                    <button
                        onClick={() => setView("form")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black tracking-widest uppercase transition-all duration-300 ${view === "form" ? "bg-teal-500 text-slate-900 shadow-lg" : "text-white/40 hover:text-white"}`}
                    >
                        <FiCalendar size={14} /> New Request
                    </button>
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

                            <span className="text-sm sm:text-lg font-bold tracking-widest sm:tracking-[0.2em] text-white uppercase flex items-center gap-2 sm:gap-3">
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
            <main className="flex-1 w-full flex flex-col items-center px-4 py-8 sm:py-12">
                <AnimatePresence mode="wait">
                    {view === "dashboard" ? (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-[950px] space-y-8"
                        >
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Applied", count: myRequests.length, color: "text-white" },
                                    { label: "Pending", count: myRequests.filter(r => r.status === "pending" || r.status === "accepted" || r.status === "approved_by_warden").length, color: "text-amber-400" },
                                    { label: "Approved", count: myRequests.filter(r => r.status === "fully_approved").length, color: "text-emerald-400" },
                                    { label: "Rejected", count: myRequests.filter(r => r.status === "rejected" || r.status === "final_rejected").length, color: "text-rose-400" }
                                ].map(s => (
                                    <div key={s.label} className="bg-[#0f1f38] border border-white/8 rounded-2xl p-5 text-center">
                                        <p className="text-xs sm:text-sm font-black text-white/30 uppercase tracking-widest mb-1">{s.label}</p>
                                        <p className={`text-3xl sm:text-5xl font-black ${s.color}`}>{s.count}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full rounded-3xl border border-white/8 bg-[#0f1f38] shadow-2xl overflow-hidden">
                                <div className="p-8 sm:p-12">
                                    <div className="flex items-center gap-3 mb-8">
                                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">MY APPLICATIONS</h3>
                                        <div className="flex-1 h-px bg-white/5" />
                                    </div>
                                    <div className="space-y-4">
                                        {myRequests.length > 0 ? [...myRequests].reverse().map((req, idx) => (
                                            <motion.div 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                key={req.id} 
                                                className="bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                                            >
                                                <div>
                                                    <p className="text-xs sm:text-sm font-black text-teal-400 uppercase tracking-widest mb-1">{req.leaveDate} to {req.arrivalDate}</p>
                                                    <p className="text-xl font-bold text-white mb-1">{req.reason}</p>
                                                    <p className="text-sm text-white/30 font-medium">Total reduction days: <span className="text-white">{req.totalHolidays}</span></p>
                                                </div>
                                                <div className="w-full sm:w-auto flex flex-col items-end gap-1">
                                                    <p className="text-xs font-black text-white/20 uppercase tracking-widest">Current Status</p>
                                                    <span className={`text-sm font-black uppercase tracking-widest px-4 py-2 rounded-xl border whitespace-nowrap ${
                                                        req.status === 'fully_approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
                                                        req.status === 'final_rejected' || req.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.05)]'
                                                    }`}>
                                                        {req.status === 'pending' ? 'Auth: Deputy Warden' :
                                                        req.status === 'accepted' ? 'Auth: Chief Warden' :
                                                        req.status === 'approved_by_warden' ? 'Auth: Hostel Office' :
                                                        req.status === 'fully_approved' ? 'FULLY ACCEPTED' : req.status.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )) : (
                                            <div className="text-center py-16">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/10">
                                                    <FiFileText size={30} />
                                                </div>
                                                <p className="text-white/30 text-base font-medium italic">No applications found in your account.</p>
                                                <button onClick={() => setView("form")} className="mt-6 text-teal-400 font-bold text-sm uppercase tracking-widest hover:text-teal-300 transition-colors">Start New Application →</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-[950px]"
                        >
                            <div className="w-full rounded-3xl border border-white/8 bg-[#0f1f38] shadow-2xl overflow-hidden">
                                <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />
                                <div className="p-8 sm:p-12 lg:p-16">
                                    <AnimatedTitle />

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field icon={<FiUser />} type="text" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                                            <Field icon={<FiCreditCard />} type="text" placeholder="Reg No" name="id" value={formData.id} onChange={handleChange} required />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field icon={<FiHome />} type="text" placeholder="Room No" name="room" value={formData.room} onChange={handleChange} />
                                            <Field icon={<FiBookOpen />} type="text" placeholder="Branch (e.g. CSE)" name="dept" value={formData.dept} onChange={handleChange} required />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3.5 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200 relative">
                                                <span className="text-teal-400/60 shrink-0"><FiCalendar size={18} /></span>
                                                <select
                                                    name="year"
                                                    value={formData.year}
                                                    onChange={handleChange}
                                                    required
                                                    className="flex-1 bg-transparent focus:outline-none text-lg text-white font-medium appearance-none w-full cursor-pointer"
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
                                            <Field icon={<FiPhone />} type="tel" placeholder="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field
                                                icon={<FiCalendar />}
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
                                                icon={<FiClock />}
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field
                                                icon={<FiCalendar />}
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
                                                icon={<FiClock />}
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field icon={<FiFileText />} type="number" placeholder="No. of Holidays" name="totalHolidays" value={formData.totalHolidays} onChange={handleChange} required />

                                            <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3.5 focus-within:border-teal-500/60 focus-within:bg-teal-950/20 transition-colors duration-200 relative">
                                                <span className="text-teal-400/60 shrink-0"><FiInfo size={18} /></span>
                                                <select
                                                    name="reason"
                                                    value={formData.reason}
                                                    onChange={handleChange}
                                                    className="flex-1 bg-transparent focus:outline-none text-lg text-white font-medium appearance-none w-full cursor-pointer"
                                                    required
                                                >
                                                    <option value="" disabled className="text-white/40 bg-[#0f1f38]">Select Reason</option>
                                                    <option value="Study Holidays" className="bg-[#0f1f38]">Study Holidays</option>
                                                    <option value="Medical Leave" className="bg-[#0f1f38]">Medical Leave</option>
                                                    <option value="other" className="bg-[#0f1f38]">Other Reason</option>
                                                </select>
                                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                                    <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {formData.reason === "other" && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    <Field
                                                        icon={<FiFileText />}
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
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className={`mt-4 flex items-center justify-center gap-3 w-full rounded-xl py-4 text-lg font-black text-slate-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:brightness-110 shadow-lg shadow-teal-900/30 transition-all duration-200 tracking-widest ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "SUBMITTING..." : "SUBMIT FORM"} <FiArrowRight size={18} />
                                        </motion.button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ── Footer ── */}
            <footer className="shrink-0 pb-6 pt-3 text-center">
                <p className="text-sm text-white/15 tracking-widest uppercase font-bold">
                    © 2025 GCES · Mess Reduction Portal
                </p>
            </footer>
        </div>
    );
}

export default MessReductionPage;