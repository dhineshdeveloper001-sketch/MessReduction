import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FiUsers, FiCheck, FiX, FiPieChart, FiList, 
    FiCheckSquare, FiSquare, FiTrendingUp, FiArrowRight,
    FiClock, FiBarChart2, FiActivity
} from "react-icons/fi";
import apiClient from "./api/apiClient";
import logo from "./assets/1000088399.png";

const YEARS = ["1st", "2nd", "3rd", "4th"];

const YEAR_COLORS = {
    "1st": { accent: "teal",    bg: "bg-teal-500",    text: "text-teal-400",    border: "border-teal-500/30",    glow: "shadow-teal-500/20",    ring: "bg-teal-500/10"  },
    "2nd": { accent: "blue",    bg: "bg-blue-500",    text: "text-blue-400",    border: "border-blue-500/30",    glow: "shadow-blue-500/20",    ring: "bg-blue-500/10"  },
    "3rd": { accent: "violet",  bg: "bg-violet-500",  text: "text-violet-400",  border: "border-violet-500/30",  glow: "shadow-violet-500/20",  ring: "bg-violet-500/10"},
    "4th": { accent: "amber",   bg: "bg-amber-500",   text: "text-amber-400",   border: "border-amber-500/30",   glow: "shadow-amber-500/20",   ring: "bg-amber-500/10" },
};

function YearStatCard({ year, requests, yearStats }) {
    const c = YEAR_COLORS[year];
    // Since we only fetch pending requests, we can't calculate approved/rejected from 'requests' array
    // We use the yearStats object for totals if available
    const yearKeyMap = { "1st": "firstYear", "2nd": "secondYear", "3rd": "thirdYear", "4th": "fourthYear" };
    const total = yearStats[yearKeyMap[year]] || 0;
    const pending = requests.filter(r => r.year === year).length;
    
    // Note: The backend doesn't seem to provide separate approved/rejected counts per year in YearWiseCountDTO
    // It just provides counts. Assuming these counts are total submissions.
    // For now, I'll display pending from the current list.
    const accepted = 0; // Backend needs to be updated to provide this
    const rejected = 0; // Backend needs to be updated to provide this

    return (
        <motion.div
            whileHover={{ scale: 1.02, translateY: -4 }}
            className={`bg-[#0f1f38] border ${c.border} rounded-3xl p-7 shadow-xl shadow-black/30 relative overflow-hidden group`}
        >
            {/* Glow orb */}
            <div className={`absolute -top-10 -right-10 w-36 h-36 ${c.bg} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-5 relative z-10">
                <div className={`px-4 py-1.5 rounded-lg ${c.ring} border ${c.border}`}>
                    <span className={`text-sm font-black tracking-[0.25em] uppercase ${c.text}`}>{year} Year</span>
                </div>
                <span className={`text-6xl font-black ${c.text}`}>{total}</span>
            </div>

            {/* Sub counts */}
            <div className="grid grid-cols-2 gap-2 relative z-10">
                {[
                    { label: "Pending",  val: pending,  color: "text-amber-400" },
                    { label: "Total Rec.", val: total, color: "text-emerald-400" },
                ].map(({ label, val, color }) => (
                    <div key={label} className="text-center">
                        <p className={`text-2xl font-black ${color}`}>{val}</p>
                        <p className="text-sm font-bold text-white/25 uppercase tracking-widest">{label}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function Deputy_warden_side() {
    const [view, setView]               = useState("dashboard");
    const [selectedYear, setSelectedYear] = useState("all");
    const [requests, setRequests]       = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [search, setSearch]           = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch pending forms for Deputy Warden
                const response = await apiClient.get("/hostelStaff/staff/deputyWarden");
                const data = response.data.map(r => ({
                    ...r,
                    id: r.formId, // map formId to id for frontend compatibility
                    year: r.year === 1 ? "1st" : r.year === 2 ? "2nd" : r.year === 3 ? "3rd" : "4th",
                    dept: r.department
                }));
                setRequests(data);

                // Fetch dashboard counts
                const countRes = await apiClient.get("/hostelStaff/staff/dashboard-count");
                setDashboardStats(countRes.data);

                // Fetch year-wise counts
                const yearCountRes = await apiClient.get("/hostelStaff/staff/deputyWarden/year-count");
                setYearStats(yearCountRes.data);

            } catch (err) {
                console.error("Error fetching Deputy Warden data:", err);
                const fallback = JSON.parse(localStorage.getItem("mock_requests") || "[]");
                setRequests(fallback);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const [dashboardStats, setDashboardStats] = useState({
        pendingDeputyWarden: 0,
        pendingWarden: 0,
        pendingOffice: 0,
        approved: 0,
        rejected: 0
    });

    const [yearStats, setYearStats] = useState({
        firstYear: 0,
        secondYear: 0,
        thirdYear: 0,
        fourthYear: 0
    });

    const handleAction = async (id, newStatus) => {
        // Backend expects 'Approve' or 'Reject' as action param
        const action = newStatus === "accepted" ? "Approve" : "Reject";
        try {
            await apiClient.patch(`/hostelStaff/staff/deputyWarden/${id}?action=${action}`);
            setRequests(prev => prev.filter(r => r.id !== id)); 
        } catch (err) {
            console.error("Action error:", err);
            alert("Failed to update status.");
        }
    };

    const handleBulkAction = async (newStatus) => {
        const action = newStatus === "accepted" ? "Approve" : "Reject";
        try {
            await apiClient.patch(`/hostelStaff/staff/deputyWarden/bulk?action=${action}`, selectedIds);
            setRequests(prev => prev.filter(r => !selectedIds.includes(r.id)));
            setSelectedIds([]);
        } catch (err) {
            console.error("Bulk action error:", err);
            alert("Failed to perform bulk action.");
        }
    };

    const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    const toggleSelectAll = () => {
        const pendingIds = filteredRequests.filter(r => r.status === "pending").map(r => r.id);
        setSelectedIds(selectedIds.length === pendingIds.length && pendingIds.length > 0 ? [] : pendingIds);
    };

    const filteredRequests = requests
        .filter(r => selectedYear === "all" ? true : r.year === selectedYear)
        .filter(r => search === "" ? true :
            r.name?.toLowerCase().includes(search.toLowerCase()) ||
            String(r.id)?.toLowerCase().includes(search.toLowerCase()) ||
            r.dept?.toLowerCase().includes(search.toLowerCase())
        );

    // Dashboard aggregates
    const totalForms     = requests.length;
    const totalPending   = requests.filter(r => r.status === "pending").length;
    const totalAccepted  = requests.filter(r => ["accepted","approved_by_warden","fully_approved"].includes(r.status)).length;
    const totalRejected  = requests.filter(r => ["rejected","final_rejected"].includes(r.status)).length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                    <p className="text-teal-400 font-black tracking-widest uppercase text-sm">Loading Panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col font-sans bg-[#0a1628] text-white">
            <div className="fixed inset-0 bg-[#0a1628] -z-10" />

            {/* ── Header ── */}
            <header className="w-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-white/5 bg-[#0a1628]/80 backdrop-blur-xl sticky top-0 z-50 gap-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <img src={logo} alt="GCES Logo" className="w-8 h-8 sm:w-11 sm:h-11 object-contain" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-teal-400/80 uppercase">Deputy Warden Panel</span>
                        <span className="text-xl sm:text-3xl font-black text-white tracking-widest uppercase">MessReduction</span>
                    </div>
                </div>

                {/* Year Tabs */}
                <div className="flex items-center gap-1.5 bg-[#112240] p-1.5 rounded-2xl border border-white/5 overflow-x-auto max-w-full [&::-webkit-scrollbar]:hidden">
                    {["all", ...YEARS].map(yr => (
                        <button
                            key={yr}
                            onClick={() => setSelectedYear(yr)}
                            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                selectedYear === yr
                                    ? yr === "all" ? "bg-white text-slate-900 shadow-xl"
                                        : `${YEAR_COLORS[yr]?.bg ?? ""} text-slate-900 shadow-xl`
                                    : "text-white/30 hover:text-white"
                            }`}
                        >
                            {yr === "all" ? "All" : yr}
                        </button>
                    ))}
                </div>

                {/* View Toggle */}
                <div className="flex bg-[#0f1f38]/60 p-1.5 sm:p-2 rounded-2xl border border-white/5 backdrop-blur-sm overflow-x-auto max-w-full [&::-webkit-scrollbar]:hidden">
                    <button onClick={() => setView("dashboard")} className={`flex items-center gap-2 px-5 sm:px-7 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-black tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${view === "dashboard" ? "bg-teal-500 text-slate-900 shadow-[0_0_20px_rgba(45,212,191,0.3)]" : "text-white/40 hover:text-white"}`}>
                        <FiBarChart2 size={16} /> Dashboard
                    </button>
                    <button onClick={() => setView("requests")} className={`flex items-center gap-2 px-5 sm:px-7 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-black tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${view === "requests" ? "bg-teal-500 text-slate-900 shadow-[0_0_20px_rgba(45,212,191,0.3)]" : "text-white/40 hover:text-white"}`}>
                        <FiList size={16} /> Requests
                    </button>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="flex-1 p-4 sm:p-8 lg:p-12">
                <AnimatePresence mode="wait">
                    {/* ════ DASHBOARD VIEW ════ */}
                    {view === "dashboard" && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                            className="max-w-7xl mx-auto space-y-10"
                        >
                            {/* Section heading */}
                            <div>
                                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3 sm:gap-4">
                                    <div className="w-1.5 h-6 sm:h-8 bg-teal-500 rounded-full" />
                                    Submission Overview
                                </h2>
                                <p className="text-white/30 text-sm sm:text-base font-medium ml-4 sm:ml-5 mt-1">
                                    {selectedYear === "all" ? "All academic years shown" : `Filtered to ${selectedYear} year submissions`}.
                                </p>
                            </div>

                            {/* ── Year Stat Cards ── */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {YEARS.map(yr => (
                                    <YearStatCard key={yr} year={yr} requests={requests} yearStats={yearStats} />
                                ))}
                            </div>

                            {/* ── Overall Status + Total ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Overall Status Tracking */}
                                <div className="lg:col-span-2 bg-[#0f1f38] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-10 scale-150 rotate-12 opacity-5 text-teal-400 pointer-events-none group-hover:opacity-10 transition-opacity duration-700">
                                        <FiActivity size={200} />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black text-white mb-6 sm:mb-8 flex items-center gap-3">
                                        <FiTrendingUp className="text-teal-400" /> Overall Status Tracking
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative z-10">
                                        {[
                                            { label: "Pending (DW)",  count: dashboardStats.pendingDeputyWarden,  color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/10"   },
                                            { label: "Approved (Total)", count: dashboardStats.approved, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/10" },
                                            { label: "Rejected (Total)", count: dashboardStats.rejected, color: "text-rose-400",    bg: "bg-rose-400/10",    border: "border-rose-400/10"    },
                                        ].map(s => (
                                            <div key={s.label} className={`p-6 sm:p-8 rounded-2xl ${s.bg} border ${s.border}`}>
                                                <p className="text-xs sm:text-sm text-white/30 uppercase font-black tracking-widest mb-2">{s.label}</p>
                                                <p className={`text-5xl sm:text-7xl font-black ${s.color}`}>{s.count}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                 {/* Total Forms */}
                                 <div className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 rounded-3xl p-8 sm:p-10 flex flex-col justify-between">
                                     <div>
                                         <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Total Forms</h3>
                                         <p className="text-white/40 text-sm sm:text-base font-medium">Cumulative submissions received.</p>
                                     </div>
                                     <p className="text-6xl sm:text-8xl font-black text-white mt-8">{dashboardStats.pendingDeputyWarden + dashboardStats.pendingWarden + dashboardStats.pendingOffice + dashboardStats.approved + dashboardStats.rejected}</p>
                                     <button
                                         onClick={() => setView("requests")}
                                         className="mt-8 flex items-center justify-center gap-3 w-full bg-white text-[#0a1628] py-4 rounded-2xl font-black text-base tracking-widest uppercase hover:bg-teal-400 transition-colors"
                                     >
                                         Manage Requests <FiArrowRight />
                                     </button>
                                 </div>
                            </div>

                            {/* ── Year-wise Bar Visual ── */}
                            <div className="bg-[#0f1f38] border border-white/5 rounded-[2.5rem] p-10 shadow-xl">
                                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                                    <FiBarChart2 className="text-teal-400" /> Submission Count by Year
                                </h3>
                                <div className="flex items-end gap-6 h-40">
                                    {YEARS.map(yr => {
                                        const yearKeyMap = { "1st": "firstYear", "2nd": "secondYear", "3rd": "thirdYear", "4th": "fourthYear" };
                                        const count = yearStats[yearKeyMap[yr]] || 0;
                                        const max   = Math.max(yearStats.firstYear, yearStats.secondYear, yearStats.thirdYear, yearStats.fourthYear, 1);
                                        const pct   = Math.round((count / max) * 100);
                                        const c     = YEAR_COLORS[yr];
                                        return (
                                            <div key={yr} className="flex-1 flex flex-col items-center gap-3">
                                                <span className={`text-base font-black ${c.text}`}>{count}</span>
                                                <div className="w-full bg-white/5 rounded-xl overflow-hidden" style={{ height: "80px" }}>
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${pct}%` }}
                                                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: YEARS.indexOf(yr) * 0.1 }}
                                                        className={`w-full ${c.bg} rounded-xl`}
                                                        style={{ marginTop: `${100 - pct}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-black text-white/30 uppercase tracking-widest">{yr} Yr</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ════ REQUESTS VIEW ════ */}
                    {view === "requests" && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                            className="max-w-7xl mx-auto space-y-6"
                        >
                            {/* Header row */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                                <div>
                                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3 sm:gap-4">
                                        <div className="w-1 h-6 sm:w-1.5 sm:h-8 bg-teal-500 rounded-full" />
                                        Review Applications {selectedYear !== "all" && <span className={`${YEAR_COLORS[selectedYear]?.text ?? "text-teal-500"} text-base sm:text-4xl`}>• {selectedYear} Year</span>}
                                    </h2>
                                    <p className="text-white/30 text-sm sm:text-base font-medium ml-4 sm:ml-5 mt-1">{filteredRequests.length} record{filteredRequests.length !== 1 ? "s" : ""} found</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Search */}
                                    <div className="flex items-center gap-2 bg-[#0f1f38] border border-white/10 rounded-xl px-4 py-2.5">
                                        <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" /></svg>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            placeholder="Search name, ID, dept…"
                                            className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none w-44"
                                        />
                                    </div>

                                    {/* Bulk actions */}
                                    <AnimatePresence>
                                        {selectedIds.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                                className="flex p-2 bg-[#0f1f38] border border-white/10 rounded-2xl gap-2 shadow-2xl"
                                            >
                                                <button onClick={() => handleBulkAction("accepted")} className="px-6 py-3 bg-emerald-500 text-slate-900 rounded-xl text-sm font-black tracking-widest uppercase hover:brightness-110 transition-all flex items-center gap-2">
                                                    <FiCheck size={14} /> Approve ({selectedIds.length})
                                                </button>
                                                <button onClick={() => handleBulkAction("rejected")} className="px-6 py-3 bg-rose-500 text-white rounded-xl text-sm font-black tracking-widest uppercase hover:brightness-110 transition-all flex items-center gap-2">
                                                    <FiX size={14} /> Reject
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="space-y-4 lg:hidden">
                                {filteredRequests.length === 0 ? (
                                    <div className="bg-[#0f1f38] border border-white/10 rounded-3xl p-12 text-center text-white/20 italic font-bold">
                                        No records found.
                                    </div>
                                ) : filteredRequests.map(req => {
                                    const yc = YEAR_COLORS[req.year] || YEAR_COLORS["1st"];
                                    return (
                                        <motion.div
                                            key={req.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`bg-[#0f1f38] border ${selectedIds.includes(req.id) ? "border-teal-500/50 shadow-[0_0_20px_rgba(45,212,191,0.1)]" : "border-white/5"} rounded-3xl p-6 space-y-5 shadow-xl transition-all`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#0a1628] border border-white/10 flex items-center justify-center text-teal-400 font-black text-xl shadow-inner">
                                                        {req.name?.charAt(0) ?? "?"}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-white">{req.name}</h4>
                                                        <p className="text-xs font-bold text-white/20 tracking-widest uppercase">{req.id}</p>
                                                    </div>
                                                </div>
                                                {req.status === "pending" && (
                                                    <button onClick={() => toggleSelect(req.id)} className={`p-2.5 rounded-xl transition-all ${selectedIds.includes(req.id) ? "bg-teal-500/20 text-teal-400" : "bg-white/5 text-white/10"}`}>
                                                        {selectedIds.includes(req.id) ? <FiCheckSquare size={18} /> : <FiSquare size={18} />}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-lg ${yc.ring} border ${yc.border} text-xs font-black ${yc.text} uppercase tracking-wider`}>
                                                    {req.year ?? "—"} Yr
                                                </span>
                                                <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-black text-white/50 border border-white/5 tracking-wider">{req.dept}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                                                <div>
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 text-center">Period</p>
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" /><span className="text-xs font-bold text-white/50">{req.leaveDate}</span></div>
                                                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-500/60" /><span className="text-xs font-bold text-white/50">{req.arrivalDate}</span></div>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Total Days</p>
                                                    <p className="text-xl font-black text-white">{req.totalHolidays}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className={`inline-flex px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
                                                    req.status === "accepted" || req.status === "approved_by_warden" || req.status === "fully_approved"
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : req.status === "rejected" || req.status === "final_rejected"
                                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                }`}>
                                                    {req.status === "pending" ? "Pending" : req.status === "accepted" ? "Approved" : req.status === "approved_by_warden" ? "Warden ✓" : "Complete"}
                                                </span>

                                                <div className="flex gap-2">
                                                    {req.status === "pending" ? (
                                                        <>
                                                            <button onClick={() => handleAction(req.id, "accepted")} className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/10 shadow-lg">
                                                                <FiCheck size={18} />
                                                            </button>
                                                            <button onClick={() => handleAction(req.id, "rejected")} className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/10 shadow-lg">
                                                                <FiX size={18} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => handleAction(req.id, "pending")} className="px-4 py-2 text-xs font-black text-white/20 uppercase tracking-widest border border-white/5 rounded-xl">
                                                            Reset
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="hidden lg:block bg-[#0f1f38] border border-white/5 rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                                    <table className="w-full text-left border-collapse min-w-[1050px]">
                                        <thead>
                                            <tr className="bg-white/[0.03] text-sm uppercase tracking-[0.3em] font-black border-b border-white/5">
                                                <th className="px-6 py-6 w-14 text-center">
                                                    <button onClick={toggleSelectAll} className="p-2 rounded-xl bg-white/5 hover:bg-teal-500/20 text-teal-400/50 hover:text-teal-400 transition-all">
                                                        {selectedIds.length === filteredRequests.filter(r => r.status === "pending").length && selectedIds.length > 0
                                                            ? <FiCheckSquare size={17} />
                                                            : <FiSquare size={17} />
                                                        }
                                                    </button>
                                                </th>
                                                <th className="px-4 py-6 text-white/50">Student</th>
                                                <th className="px-4 py-6 text-white/50 text-center">Year</th>
                                                <th className="px-4 py-6 text-white/50 text-center">Dept</th>
                                                <th className="px-4 py-6 text-white/50 text-center">Period</th>
                                                <th className="px-4 py-6 text-white/50 text-center">Days</th>
                                                <th className="px-4 py-6 text-white/50">Reason</th>
                                                <th className="px-4 py-6 text-white/50 text-center">Status</th>
                                                <th className="px-6 py-6 text-right w-36 text-white/50">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.03]">
                                            {filteredRequests.length === 0 ? (
                                                <tr>
                                                    <td colSpan={9} className="py-20 text-center text-white/20 text-base font-bold italic tracking-widest">No records found.</td>
                                                </tr>
                                            ) : filteredRequests.map(req => {
                                                const yc = YEAR_COLORS[req.year] || YEAR_COLORS["1st"];
                                                return (
                                                    <motion.tr
                                                        layout
                                                        key={req.id}
                                                        className={`group hover:bg-white/[0.02] transition-colors ${selectedIds.includes(req.id) ? "bg-teal-500/[0.03]" : ""}`}
                                                    >
                                                        <td className="px-6 py-5 text-center">
                                                            {req.status === "pending" && (
                                                                <button onClick={() => toggleSelect(req.id)} className={`p-2 rounded-xl transition-all ${selectedIds.includes(req.id) ? "bg-teal-500/20 text-teal-400" : "bg-white/5 text-white/10 group-hover:text-white/30"}`}>
                                                                    {selectedIds.includes(req.id) ? <FiCheckSquare size={17} /> : <FiSquare size={17} />}
                                                                </button>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-2xl bg-[#0a1628] border border-white/10 flex items-center justify-center text-teal-400 font-black text-xl shadow-inner group-hover:border-teal-500/30 transition-colors">
                                                                    {req.name?.charAt(0) ?? "?"}
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-black text-white group-hover:text-teal-400 transition-colors">{req.name}</p>
                                                                    <p className="text-sm text-white/20 font-bold tracking-tight uppercase">{req.id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-5 text-center">
                                                            <span className={`px-3 py-1.5 rounded-lg ${yc.ring} border ${yc.border} text-sm font-black ${yc.text} uppercase tracking-wider`}>
                                                                {req.year ?? "—"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-5 text-center">
                                                            <span className="px-3 py-1 bg-white/5 rounded-lg text-sm font-black text-white/50 border border-white/5 tracking-wider">{req.dept}</span>
                                                        </td>
                                                        <td className="px-4 py-5">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" /><span className="text-xs font-bold text-white/50">{req.leaveDate}</span></div>
                                                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-500/60" /><span className="text-xs font-bold text-white/50">{req.arrivalDate}</span></div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-5 text-center">
                                                            <span className="text-base font-black text-white/80">{req.totalHolidays}</span>
                                                        </td>
                                                        <td className="px-4 py-5">
                                                            <p className="text-sm font-medium text-white/40 leading-tight max-w-[140px] truncate">{req.reason}</p>
                                                        </td>
                                                        <td className="px-4 py-5 text-center">
                                                            <motion.div layout className={`inline-flex px-4 py-1.5 rounded-xl border text-sm font-black uppercase tracking-widest ${
                                                                req.status === "accepted" || req.status === "approved_by_warden" || req.status === "fully_approved"
                                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                    : req.status === "rejected" || req.status === "final_rejected"
                                                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                            }`}>
                                                                {req.status === "pending" ? "Pending" :
                                                                 req.status === "accepted" ? "Approved" :
                                                                 req.status === "approved_by_warden" ? "Warden ✓" :
                                                                 req.status === "fully_approved" ? "Complete" :
                                                                 req.status === "rejected" ? "Rejected" :
                                                                 req.status === "final_rejected" ? "Fin. Rejected" : req.status}
                                                            </motion.div>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            {req.status === "pending" ? (
                                                                <div className="flex justify-end gap-2">
                                                                    <button onClick={() => handleAction(req.id, "accepted")} className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-slate-900 transition-all duration-300 border border-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                                                        <FiCheck size={16} />
                                                                    </button>
                                                                    <button onClick={() => handleAction(req.id, "rejected")} className="p-2.5 bg-rose-500/10 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all duration-300 border border-rose-500/10 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                                                                        <FiX size={16} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => handleAction(req.id, "pending")} className="px-4 py-2 text-sm font-black text-white/20 hover:text-teal-400 uppercase tracking-widest border border-white/5 rounded-xl hover:border-teal-500/30 transition-all">
                                                                    Reset
                                                                </button>
                                                            )}
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ── Footer ── */}
            <footer className="px-8 py-5 text-center border-t border-white/5 bg-[#0a1628]/80 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
                    <p className="text-sm text-white/10 tracking-[0.5em] uppercase font-bold">© 2025 Government College of Engineering · Srirangam</p>
                    <div className="flex gap-8">
                        <span className="text-sm text-teal-400/30 font-black tracking-widest uppercase">Deputy Warden — 1 Member</span>
                        <span className="text-sm text-teal-400/30 font-black tracking-widest uppercase">System Stable</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Deputy_warden_side;