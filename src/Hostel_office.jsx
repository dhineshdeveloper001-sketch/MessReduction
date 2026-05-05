import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FiCheckSquare, FiLayers, FiPrinter, FiArchive,
    FiShield, FiZap, FiArrowRight, FiCalendar, FiBarChart2
} from "react-icons/fi";
import apiClient from "./api/apiClient";
import logo from './assets/1000088399.png';

const YEARS = ["1st", "2nd", "3rd", "4th"];

const YEAR_COLORS = {
    "1st": { text: "text-teal-400",   bg: "bg-teal-500",   ring: "bg-teal-500/10",   border: "border-teal-500/30"   },
    "2nd": { text: "text-blue-400",   bg: "bg-blue-500",   ring: "bg-blue-500/10",   border: "border-blue-500/30"   },
    "3rd": { text: "text-violet-400", bg: "bg-violet-500", ring: "bg-violet-500/10", border: "border-violet-500/30" },
    "4th": { text: "text-amber-400",  bg: "bg-amber-500",  ring: "bg-amber-500/10",  border: "border-amber-500/30"  },
};

function YearMiniCard({ year, requests, yearStats }) {
    const c = YEAR_COLORS[year];
    const yearKeyMap = { "1st": "firstYear", "2nd": "secondYear", "3rd": "thirdYear", "4th": "fourthYear" };
    const total = yearStats[yearKeyMap[year]] || 0;
    const pending = requests.filter(r => r.year === year).length;
    
    // Note: Approved (processed) vs Completed (done) depends on backend Providing more info
    // For now, mapping pending to 'To Process' and assuming total is total submissions
    const approved = pending; 
    const done = 0; 

    return (
        <motion.div
            whileHover={{ scale: 1.03, translateY: -3 }}
            className={`bg-[#0f1f38] border ${c.border} rounded-2xl p-6 relative overflow-hidden group`}
        >
            <div className={`absolute -top-6 -right-6 w-24 h-24 ${c.bg} opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-opacity`} />
            <div className="flex items-center justify-between mb-5">
                <span className={`text-sm font-black tracking-[0.25em] uppercase ${c.text}`}>{year} Year</span>
                <span className={`text-4xl font-black ${c.text}`}>{total}</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                <div
                    className={`h-full ${c.bg} rounded-full transition-all duration-700`}
                    style={{ width: total ? `${Math.round((pending / total) * 100)}%` : "0%" }}
                />
            </div>
            <div className="grid grid-cols-2 gap-1 text-center">
                <div>
                    <p className="text-lg font-black text-amber-400">{pending}</p>
                    <p className="text-xs text-white/20 uppercase tracking-widest font-bold">To Process</p>
                </div>
                 <div>
                    <p className="text-lg font-black text-white/50">{total}</p>
                    <p className="text-xs text-white/20 uppercase tracking-widest font-bold">Total</p>
                </div>
            </div>
        </motion.div>
    );
}

const HostelOffice = () => {
    const [requests, setRequests]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [view, setView]           = useState("pending_office"); // 'pending_office' | 'completed'
    const [selectedYear, setSelectedYear] = useState("all");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await apiClient.get("/hostelStaff/staff/office");
            const data = response.data.map(r => ({
                ...r,
                id: r.formId,
                year: r.year === 1 ? "1st" : r.year === 2 ? "2nd" : r.year === 3 ? "3rd" : "4th",
                dept: r.department
            }));
            setRequests(data);
            
            const yearCountRes = await apiClient.get("/hostelStaff/staff/office/year-count");
            setYearStats(yearCountRes.data);

        } catch (err) {
            console.error("Error fetching office data:", err);
            const mocked = JSON.parse(localStorage.getItem("mock_requests") || "[]");
            setRequests(mocked);
        } finally {
            setLoading(false);
        }
    };

    const [yearStats, setYearStats] = useState({
        firstYear: 0,
        secondYear: 0,
        thirdYear: 0,
        fourthYear: 0
    });

    const handleFinalSeal = async (id, newStatus) => {
        const action = newStatus === "fully_approved" ? "Approve" : "Reject";
        try {
            await apiClient.patch(`/hostelStaff/staff/office/${id}?action=${action}`);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error("Office action error:", err);
            alert("Failed to update status.");
        }
    };

    const pendingOffice = requests.filter(r =>
        r.status === "approved_by_warden" &&
        (selectedYear === "all" ? true : r.year === selectedYear)
    );
    const completed = requests.filter(r =>
        r.status === "fully_approved" &&
        (selectedYear === "all" ? true : r.year === selectedYear)
    );

    const activeList = view === "pending_office" ? pendingOffice : completed;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#0a1628] text-white font-sans selection:bg-emerald-500/30">
            {/* ── Header ── */}
            <header className="w-full flex items-center justify-between px-4 sm:px-10 py-4 sm:py-6 border-b border-white/5 bg-[#0a1628]/80 backdrop-blur-xl sticky top-0 z-50 gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3 sm:gap-5">
                    <img src={logo} alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
                     <div className="flex flex-col leading-tight">
                        <span className="text-xs sm:text-base font-black tracking-[.2em] sm:tracking-[.3em] text-emerald-400/80 uppercase">Administration</span>
                        <span className="text-xl sm:text-4xl font-black text-white tracking-widest uppercase">Hostel Office</span>
                    </div>
                </div>

                {/* Year Filter */}
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
                <div className="flex bg-[#0f1f38] p-1.5 sm:p-2 rounded-2xl border border-white/5 overflow-x-auto max-w-full [&::-webkit-scrollbar]:hidden">
                     <button
                        onClick={() => setView("pending_office")}
                        className={`flex items-center gap-2 px-5 sm:px-9 py-2.5 sm:py-3.5 rounded-xl text-sm sm:text-base font-black tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${view === "pending_office" ? "bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20" : "text-white/40 hover:text-white"}`}
                    >
                        <FiZap size={16} /> To Process ({pendingOffice.length})
                    </button>
                     <button
                        onClick={() => setView("completed")}
                        className={`flex items-center gap-2 px-5 sm:px-9 py-2.5 sm:py-3.5 rounded-xl text-sm sm:text-base font-black tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${view === "completed" ? "bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20" : "text-white/40 hover:text-white"}`}
                    >
                        <FiArchive size={16} /> Archive ({completed.length})
                    </button>
                </div>
            </header>

            {/* ── Main content ── */}
            <main className="max-w-7xl mx-auto p-10 lg:p-16">

                {/* ── Year-wise Stat Cards ── */}
                <div className="mb-12">
                     <div className="flex items-center gap-3 mb-6">
                        <FiBarChart2 className="text-emerald-400" size={20} />
                        <h2 className="text-xl font-black text-white tracking-tight">Year-wise Processing Overview</h2>
                        <div className="flex-1 h-px bg-white/5 ml-2" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {YEARS.map(yr => (
                            <YearMiniCard key={yr} year={yr} requests={requests} yearStats={yearStats} />
                        ))}
                    </div>
                </div>

                {/* ── Global Stats ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                     <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-[2.5rem] p-10 lg:col-span-1">
                        <h3 className="text-base font-black text-emerald-400 uppercase tracking-widest mb-4">Office Protocol</h3>
                        <p className="text-lg text-white/40 leading-relaxed font-medium mb-8">
                            Requests validated by Deputy Wardens, approved by Wardens. Final acceptance updates Mess Bill reductions.
                        </p>
                         <div className="flex items-center gap-3">
                            <FiShield className="text-emerald-500" />
                            <span className="text-sm font-black text-white/20 uppercase tracking-[.2em]">Verified Secure Workflow</span>
                        </div>
                    </div>

                    <div className="bg-[#0f1f38] border border-white/5 rounded-[2.5rem] p-8 sm:p-10 lg:col-span-2 flex flex-col sm:flex-row items-center justify-around gap-8 sm:gap-4">
                         <div className="text-center">
                            <p className="text-xs sm:text-sm text-white/20 font-black uppercase tracking-widest mb-2">Pending Office</p>
                            <p className="text-5xl sm:text-8xl font-black text-amber-400">{requests.length}</p>
                        </div>
                        <div className="hidden sm:block w-px h-16 bg-white/5" />
                         <div className="text-center">
                            <p className="text-xs sm:text-sm text-white/20 font-black uppercase tracking-widest mb-2">Total Submissions</p>
                            <p className="text-5xl sm:text-8xl font-black text-white">{yearStats.firstYear + yearStats.secondYear + yearStats.thirdYear + yearStats.fourthYear}</p>
                        </div>
                    </div>
                </div>

                {/* ── Request List ── */}
                 <div className="mb-4 flex items-center gap-3 px-1">
                    <h3 className="text-2xl font-black text-white">
                        {view === "pending_office" ? "Pending Final Seal" : "Completed Archive"}
                        {selectedYear !== "all" && <span className={`ml-2 ${YEAR_COLORS[selectedYear]?.text ?? ""}`}>— {selectedYear} Year</span>}
                    </h3>
                     <div className="flex-1 h-px bg-white/5" />
                    <span className="text-sm text-white/20 font-bold">{activeList.length} record{activeList.length !== 1 ? "s" : ""}</span>
                </div>

                <AnimatePresence mode="popLayout">
                    {activeList.length > 0 ? (
                        <div className="space-y-6">
                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4">
                                {activeList.map((req, idx) => {
                                    const yc = YEAR_COLORS[req.year] || YEAR_COLORS["1st"];
                                    return (
                                        <motion.div
                                            key={req.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-[#0f1f38] border border-white/5 rounded-3xl p-6 space-y-5 shadow-xl"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl bg-[#0a1628] flex items-center justify-center border ${yc.border} font-black text-2xl ${yc.text}`}>
                                                    {req.name?.charAt(0) ?? "?"}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black text-white">{req.name}</h4>
                                                    <p className="text-sm font-bold text-white/20 tracking-widest uppercase">{req.id} • {req.dept}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-lg ${yc.ring} border ${yc.border} text-xs font-black ${yc.text} uppercase tracking-wider`}>{req.year} Yr</span>
                                                <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-black text-white/50 border border-white/5 tracking-wider">{req.totalHolidays} Days</span>
                                            </div>

                                            <div className="py-4 border-y border-white/5">
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Period</p>
                                                <p className="text-sm font-bold text-white/60">{req.leaveDate} – {req.arrivalDate}</p>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                {view === "pending_office" ? (
                                                    <button
                                                        onClick={() => handleFinalSeal(req.id, "fully_approved")}
                                                        className="w-full py-4 bg-emerald-500 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        Final Process <FiCheckSquare size={16} />
                                                    </button>
                                                ) : (
                                                    <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                                        <FiCheckSquare className="text-emerald-500" />
                                                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Closed & Dispatched</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Desktop List View */}
                            <div className="hidden lg:block space-y-5">
                                {activeList.map((req, idx) => {
                                    const yc = YEAR_COLORS[req.year] || YEAR_COLORS["1st"];
                                    return (
                                        <motion.div
                                            layout
                                            key={req.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                            className="bg-[#0f1f38] border border-white/5 rounded-3xl p-7 hover:border-emerald-500/30 transition-all group"
                                        >
                                             <div className="flex flex-row items-center justify-between gap-7">
                                                <div className="flex gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl bg-[#0a1628] flex items-center justify-center border ${yc.border} group-hover:border-emerald-500/50 transition-colors font-black text-2xl ${yc.text}`}>
                                                        {req.name?.charAt(0) ?? "?"}
                                                    </div>
                                                     <div>
                                                        <h4 className="text-2xl font-black text-white flex items-center gap-3 flex-wrap">
                                                            {req.name}
                                                            <span className="px-2.5 py-1 bg-white/5 rounded text-sm text-white/30 uppercase tracking-tighter">REF: {req.id}</span>
                                                            <span className={`px-2.5 py-1 ${yc.ring} border ${yc.border} rounded text-sm ${yc.text} uppercase font-black`}>{req.year} Yr</span>
                                                        </h4>
                                                         <p className="text-sm font-black text-white/20 uppercase tracking-widest mt-2 mb-2">{req.dept}</p>
                                                        <div className="flex gap-4 flex-wrap">
                                                            <span className="flex items-center gap-1.5 text-sm text-white/40">
                                                                <FiCalendar size={11} /> {req.leaveDate} – {req.arrivalDate}
                                                            </span>
                                                            <span className="flex items-center gap-1.5 text-sm text-white/40">
                                                                <FiLayers size={11} /> {req.totalHolidays} Days
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-5">
                                                    {view === "pending_office" ? (
                                                        <>
                                                            <button className="p-3.5 bg-white/5 text-white/40 rounded-2xl hover:bg-white/10 hover:text-white transition-all">
                                                                <FiPrinter size={18} />
                                                            </button>
                                                             <button
                                                                onClick={() => handleFinalSeal(req.id, "fully_approved")}
                                                                className="px-10 py-4 bg-emerald-500 text-slate-900 rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20"
                                                            >
                                                                Final Process <FiCheckSquare size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                         <div className="flex items-center gap-3 px-6 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                                            <FiCheckSquare className="text-emerald-500" />
                                                            <span className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em]">Closed & Dispatched</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[4rem]">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5 text-white/10">
                                <FiArchive size={32} />
                            </div>
                             <p className="text-white/20 font-black uppercase tracking-[0.3em] text-base">No pending files present</p>
                            {selectedYear !== "all" && (
                                <p className="text-white/10 text-sm mt-2 font-medium">Showing {selectedYear} year only — try "All" to see everything</p>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default HostelOffice;
