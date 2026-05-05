import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FiCheckSquare, FiLayers, FiPrinter, FiArchive,
    FiShield, FiZap, FiArrowRight, FiCalendar, FiBarChart2
} from "react-icons/fi";
import logo from './assets/1000088399.png';

const YEARS = ["1st", "2nd", "3rd", "4th"];

const YEAR_COLORS = {
    "1st": { text: "text-teal-400",   bg: "bg-teal-500",   ring: "bg-teal-500/10",   border: "border-teal-500/30"   },
    "2nd": { text: "text-blue-400",   bg: "bg-blue-500",   ring: "bg-blue-500/10",   border: "border-blue-500/30"   },
    "3rd": { text: "text-violet-400", bg: "bg-violet-500", ring: "bg-violet-500/10", border: "border-violet-500/30" },
    "4th": { text: "text-amber-400",  bg: "bg-amber-500",  ring: "bg-amber-500/10",  border: "border-amber-500/30"  },
};

function YearMiniCard({ year, requests }) {
    const c        = YEAR_COLORS[year];
    const approved = requests.filter(r => r.year === year && r.status === "approved_by_warden").length;
    const done     = requests.filter(r => r.year === year && r.status === "fully_approved").length;
    const total    = requests.filter(r => r.year === year).length;

    return (
        <motion.div
            whileHover={{ scale: 1.03, translateY: -3 }}
            className={`bg-[#0f1f38] border ${c.border} rounded-2xl p-6 relative overflow-hidden group`}
        >
            <div className={`absolute -top-6 -right-6 w-24 h-24 ${c.bg} opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-opacity`} />
            <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-black tracking-[0.25em] uppercase ${c.text}`}>{year} Year</span>
                <span className={`text-2xl font-black ${c.text}`}>{total}</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                <div
                    className={`h-full ${c.bg} rounded-full transition-all duration-700`}
                    style={{ width: total ? `${Math.round(((approved + done) / total) * 100)}%` : "0%" }}
                />
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
                <div>
                    <p className="text-sm font-black text-amber-400">{approved}</p>
                    <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">To Process</p>
                </div>
                <div>
                    <p className="text-sm font-black text-emerald-400">{done}</p>
                    <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Completed</p>
                </div>
                <div>
                    <p className="text-sm font-black text-white/50">{total}</p>
                    <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Total</p>
                </div>
            </div>
        </motion.div>
    );
}

const HostelOffice = ({ onLogout }) => {
    const [requests, setRequests]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [view, setView]           = useState("pending_office"); // 'pending_office' | 'completed'
    const [selectedYear, setSelectedYear] = useState("all");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = sessionStorage.getItem("staffToken");
            const response = await fetch("http://localhost:8081/api/hostelStaff/staff/office", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed");
            const data = await response.json();
            setRequests(data);
        } catch (e) {
            console.error("Error fetching office requests:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalSeal = async (id, newStatus) => {
        const updated = requests.map(r => (r.formId ?? r.id) === id ? { ...r, formStatus: newStatus } : r);
        setRequests(updated);
        try {
            const token = sessionStorage.getItem("staffToken");
            await fetch(`http://localhost:8081/api/hostelStaff/staff/office/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (e) {
            console.error("Failed to update:", e);
        }
    };

    // Normalize backend field names
    const normalize = (r) => ({
        ...r,
        id: r.formId ?? r.id,
        name: r.studentName ?? r.name,
        dept: r.department ?? r.dept,
        year: r.year ? String(r.year) : r.year,
        status: r.formStatus ?? r.status,
        room: r.roomNo ?? r.room,
    });
    const normalizedRequests = requests.map(normalize);

    const pendingOffice = normalizedRequests.filter(r =>
        ["APPROVED_BY_WARDEN","approved_by_warden"].includes(r.status) &&
        (selectedYear === "all" ? true : String(r.year) === selectedYear.replace('st','').replace('nd','').replace('rd','').replace('th',''))
    );
    const completed = normalizedRequests.filter(r =>
        ["FULLY_APPROVED","fully_approved"].includes(r.status) &&
        (selectedYear === "all" ? true : String(r.year) === selectedYear.replace('st','').replace('nd','').replace('rd','').replace('th',''))
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
            <header className="w-full flex items-center justify-between px-10 py-6 border-b border-white/5 bg-[#0a1628]/80 backdrop-blur-xl sticky top-0 z-50 gap-4 flex-wrap">
                <div className="flex items-center gap-5">
                    <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
                    <div className="flex flex-col">
                        <span className="text-xs font-black tracking-[.3em] text-emerald-400/80 uppercase">Administration</span>
                        <span className="text-2xl font-black text-white tracking-widest uppercase">Hostel Office</span>
                    </div>
                </div>

                {/* Year Filter */}
                <div className="flex items-center gap-1.5 bg-[#112240] p-1.5 rounded-2xl border border-white/5">
                    {["all", ...YEARS].map(yr => (
                        <button
                            key={yr}
                            onClick={() => setSelectedYear(yr)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
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
                <div className="flex bg-[#0f1f38] p-1.5 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setView("pending_office")}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${view === "pending_office" ? "bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20" : "text-white/40 hover:text-white"}`}
                    >
                        <FiZap size={15} /> To Process ({pendingOffice.length})
                    </button>
                    <button
                        onClick={() => setView("completed")}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${view === "completed" ? "bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20" : "text-white/40 hover:text-white"}`}
                    >
                        <FiArchive size={15} /> Archive ({completed.length})
                    </button>
                </div>
                {onLogout && (
                    <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 border border-rose-500/20 rounded-xl text-[10px] font-black text-rose-400 uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
                        <FiShield size={13} /> Logout
                    </button>
                )}
            </header>

            {/* ── Main content ── */}
            <main className="max-w-7xl mx-auto p-10 lg:p-16">

                {/* ── Year-wise Stat Cards ── */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <FiBarChart2 className="text-emerald-400" size={20} />
                        <h2 className="text-lg font-black text-white tracking-tight">Year-wise Processing Overview</h2>
                        <div className="flex-1 h-px bg-white/5 ml-2" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {YEARS.map(yr => (
                            <YearMiniCard key={yr} year={yr} requests={requests} />
                        ))}
                    </div>
                </div>

                {/* ── Global Stats ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-[2.5rem] p-10 lg:col-span-1">
                        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">Office Protocol</h3>
                        <p className="text-sm text-white/40 leading-relaxed font-medium mb-8">
                            Requests validated by Deputy Wardens, approved by Wardens. Final acceptance updates Mess Bill reductions.
                        </p>
                        <div className="flex items-center gap-3">
                            <FiShield className="text-emerald-500" />
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[.2em]">Verified Secure Workflow</span>
                        </div>
                    </div>

                    <div className="bg-[#0f1f38] border border-white/5 rounded-[2.5rem] p-10 lg:col-span-2 flex items-center justify-around">
                        <div className="text-center">
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-2">Warden Approved</p>
                            <p className="text-6xl font-black text-amber-400">{normalizedRequests.filter(r => ["APPROVED_BY_WARDEN","approved_by_warden"].includes(r.status)).length}</p>
                        </div>
                        <div className="w-px h-16 bg-white/5" />
                        <div className="text-center text-emerald-500">
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-2">Final Approvals</p>
                            <p className="text-6xl font-black">{normalizedRequests.filter(r => ["FULLY_APPROVED","fully_approved"].includes(r.status)).length}</p>
                        </div>
                        <div className="w-px h-16 bg-white/5" />
                        <div className="text-center">
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-2">All Entries</p>
                            <p className="text-6xl font-black text-white">{normalizedRequests.length}</p>
                        </div>
                    </div>
                </div>

                {/* ── Request List ── */}
                <div className="mb-4 flex items-center gap-3 px-1">
                    <h3 className="text-xl font-black text-white">
                        {view === "pending_office" ? "Pending Final Seal" : "Completed Archive"}
                        {selectedYear !== "all" && <span className={`ml-2 ${YEAR_COLORS[selectedYear]?.text ?? ""}`}>— {selectedYear} Year</span>}
                    </h3>
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-xs text-white/20 font-bold">{activeList.length} record{activeList.length !== 1 ? "s" : ""}</span>
                </div>

                <AnimatePresence mode="popLayout">
                    {activeList.length > 0 ? (
                        <div className="space-y-5">
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
                                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-7">
                                            <div className="flex gap-5">
                                                <div className={`w-14 h-14 rounded-2xl bg-[#0a1628] flex items-center justify-center border ${yc.border} group-hover:border-emerald-500/50 transition-colors font-black text-xl ${yc.text}`}>
                                                    {req.name?.charAt(0) ?? "?"}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white flex items-center gap-3 flex-wrap">
                                                        {req.name}
                                                        <span className="px-2 py-0.5 bg-white/5 rounded text-[9px] text-white/30 uppercase tracking-tighter">REF: {req.id}</span>
                                                        <span className={`px-2 py-0.5 ${yc.ring} border ${yc.border} rounded text-[9px] ${yc.text} uppercase font-black`}>{req.year} Yr</span>
                                                    </h4>
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1 mb-2">{req.dept}</p>
                                                    <div className="flex gap-4 flex-wrap">
                                                        <span className="flex items-center gap-1.5 text-xs text-white/40">
                                                            <FiCalendar size={11} /> {req.leaveDate} – {req.arrivalDate}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-xs text-white/40">
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
                                                            onClick={() => handleFinalSeal(req.id, "FULLY_APPROVED")}
                                                            className="px-9 py-3.5 bg-emerald-500 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20"
                                                        >
                                                            Final Process <FiCheckSquare size={15} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-3 px-5 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                                        <FiCheckSquare className="text-emerald-500" />
                                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Closed & Dispatched</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[4rem]">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5 text-white/10">
                                <FiArchive size={32} />
                            </div>
                            <p className="text-white/20 font-black uppercase tracking-[0.3em] text-sm">No pending files present</p>
                            {selectedYear !== "all" && (
                                <p className="text-white/10 text-xs mt-2 font-medium">Showing {selectedYear} year only — try "All" to see everything</p>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default HostelOffice;
