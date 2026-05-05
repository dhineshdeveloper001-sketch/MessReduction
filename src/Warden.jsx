import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FiCheckCircle, FiClock, FiFileText, FiFilter, FiLogOut,
    FiShield, FiTrendingUp, FiArrowRight, FiCalendar, FiMapPin, FiUsers,
    FiCheck, FiX, FiHash
} from "react-icons/fi";
import logo from './assets/1000088399.png';

const YEARS = ["1st", "2nd", "3rd", "4th"];

const YEAR_THEME = {
    "1st": { color: "teal",   active: "bg-teal-500",  text: "text-teal-400",  border: "border-teal-500/30",  ring: "bg-teal-500/10",   glow: "shadow-teal-500/30"  },
    "2nd": { color: "blue",   active: "bg-blue-500",  text: "text-blue-400",  border: "border-blue-500/30",  ring: "bg-blue-500/10",   glow: "shadow-blue-500/30"  },
    "3rd": { color: "violet", active: "bg-violet-500",text: "text-violet-400",border: "border-violet-500/30",ring: "bg-violet-500/10", glow: "shadow-violet-500/30"},
    "4th": { color: "amber",  active: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/30", ring: "bg-amber-500/10",  glow: "shadow-amber-500/30" },
};

/* ── Year Selection Screen ── */
function YearSelectScreen({ onSelect }) {
    return (
        <div className="min-h-screen w-full bg-[#0a1628] flex flex-col items-center justify-center font-sans text-white px-6">
            {/* Background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col items-center gap-10 max-w-2xl w-full"
            >
                {/* Logo + Title */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <img src={logo} alt="GCES" className="w-16 h-16 object-contain" />
                    <div>
                        <p className="text-[10px] font-black tracking-[0.35em] text-teal-400/70 uppercase mb-1">Authority Panel</p>
                        <h1 className="text-4xl font-black text-white tracking-widest uppercase">Chief Warden</h1>
                        <p className="text-sm text-white/30 font-medium mt-2">Select your year assignment to continue</p>
                    </div>
                </div>

                {/* Year Cards */}
                <div className="grid grid-cols-2 gap-5 w-full">
                    {YEARS.map((yr, i) => {
                        const t = YEAR_THEME[yr];
                        return (
                            <motion.button
                                key={yr}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.2 }}
                                whileHover={{ scale: 1.04, translateY: -4 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onSelect(yr)}
                                className={`group relative bg-[#0f1f38] ${t.border} border rounded-3xl p-8 flex flex-col items-start gap-4 text-left overflow-hidden hover:shadow-2xl ${t.glow} transition-all duration-300`}
                            >
                                <div className={`absolute -top-8 -right-8 w-32 h-32 ${t.active} opacity-5 rounded-full blur-2xl group-hover:opacity-15 transition-opacity duration-500`} />
                                <div className={`w-12 h-12 rounded-2xl ${t.ring} border ${t.border} flex items-center justify-center`}>
                                    <FiUsers className={t.text} size={22} />
                                </div>
                                <div>
                                    <p className={`text-[10px] font-black tracking-[0.3em] uppercase ${t.text} mb-1`}>Year {i + 1}</p>
                                    <h3 className="text-3xl font-black text-white">{yr}</h3>
                                    <p className="text-xs text-white/30 font-medium mt-1">Warden Panel</p>
                                </div>
                                <div className={`flex items-center gap-2 ${t.text} text-[10px] font-black uppercase tracking-widest mt-auto`}>
                                    Enter <FiArrowRight size={12} />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                <p className="text-[10px] text-white/15 tracking-widest uppercase">© 2025 GCES · Mess Reduction Portal</p>
            </motion.div>
        </div>
    );
}

/* ── Main Warden Panel ── */
const Warden = ({ assignedYear = null }) => {
    // If a URL-level year was provided, start there directly (no selection screen)
    const [selectedYear, setSelectedYear] = useState(assignedYear);
    const [requests, setRequests]         = useState([]);
    const [loading, setLoading]           = useState(true);
    const [view, setView]                 = useState("pending_final"); // 'pending_final' | 'finalized'

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch("http://localhost:5000/requests");
            const data = await response.json();
            setRequests(data);
        } catch {
            const mocked = JSON.parse(localStorage.getItem("mock_requests") || "[]");
            setRequests(mocked);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalAction = async (id, newStatus) => {
        const updated = requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
        setRequests(updated);
        try {
            await fetch(`http://localhost:5000/requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
        } catch {
            const mocked = JSON.parse(localStorage.getItem("mock_requests") || "[]");
            const idx = mocked.findIndex(r => r.id === id);
            if (idx !== -1) { mocked[idx].status = newStatus; localStorage.setItem("mock_requests", JSON.stringify(mocked)); }
        }
    };

    // ── Year selection screen (only shown when NO assignedYear from URL) ──
    if (!selectedYear) {
        return <YearSelectScreen onSelect={(yr) => { setSelectedYear(yr); setView("pending_final"); }} />;
    }

    const t = YEAR_THEME[selectedYear];

    // Filter requests: Warden only sees requests that belong to their assigned year AND were accepted by Deputy Warden
    const allForYear       = requests.filter(r => r.year === selectedYear);
    const pendingFinal     = allForYear.filter(r => r.status === "accepted");
    const finalized        = allForYear.filter(r => ["approved_by_warden", "final_rejected"].includes(r.status));
    const totalForYear     = allForYear.length;
    const approvedCount    = allForYear.filter(r => r.status === "approved_by_warden" || r.status === "fully_approved").length;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className={`w-16 h-16 border-4 border-t-${t.color}-500 border-${t.color}-500/20 rounded-full animate-spin`} />
                    <p className={`${t.text} font-black tracking-widest uppercase text-xs`}>Loading {selectedYear} Year Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#0a1628] text-white font-sans selection:bg-teal-500/30">
            {/* ── Header ── */}
            <header className="w-full flex items-center justify-between px-10 py-6 border-b border-white/5 bg-[#0a1628]/80 backdrop-blur-xl sticky top-0 z-50 gap-4 flex-wrap">
                <div className="flex items-center gap-5">
                    <div className={`p-2 ${t.ring} rounded-2xl border ${t.border}`}>
                        <img src={logo} alt="Logo" className="w-11 h-11 object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-sm font-black tracking-[.3em] ${t.text} uppercase`}>Authority Panel</span>
                        <span className="text-3xl font-black text-white tracking-widest uppercase">Chief Warden</span>
                    </div>
                </div>

                {/* Year badge — show switch only when NOT locked to a URL endpoint */}
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 ${t.ring} border ${t.border} rounded-2xl`}>
                        <div className={`w-2 h-2 rounded-full ${t.active} animate-pulse`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${t.text}`}>{selectedYear} Year Warden</span>
                    </div>
                    {/* Switch Year only available when arrived via /warden (no assignedYear prop) */}
                    {!assignedYear && (
                        <button
                            onClick={() => setSelectedYear(null)}
                            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-white hover:border-white/20 transition-all"
                        >
                            <FiLogOut size={13} /> Switch Year
                        </button>
                    )}
                </div>

                {/* View Toggle */}
                <div className={`flex bg-[#0f1f38] p-1.5 rounded-2xl border border-white/5 shadow-2xl`}>
                        <button
                            onClick={() => setView("pending_final")}
                            className={`flex items-center gap-2 px-10 py-4 rounded-xl text-sm font-black tracking-widest uppercase transition-all duration-300 ${view === "pending_final" ? `${t.active} text-slate-900 shadow-lg` : "text-white/40 hover:text-white"}`}
                        >
                            <FiClock size={18} /> Pending ({pendingFinal.length})
                        </button>
                        <button
                            onClick={() => setView("finalized")}
                            className={`flex items-center gap-2 px-10 py-4 rounded-xl text-sm font-black tracking-widest uppercase transition-all duration-300 ${view === "finalized" ? `${t.active} text-slate-900 shadow-lg` : "text-white/40 hover:text-white"}`}
                        >
                            <FiCheckCircle size={18} /> Finalized ({finalized.length})
                        </button>
                </div>
            </header>

            {/* ── Main content ── */}
            <main className="max-w-7xl mx-auto p-10 lg:p-16">
                {/* ── Stats Row ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Main stat */}
                    <div className={`col-span-1 md:col-span-1 bg-[#0f1f38] border ${t.border} rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group`}>
                        <div className={`absolute -top-6 -right-6 w-28 h-28 ${t.active} opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-opacity`} />
                        <div>
                            <h3 className={`${t.text} text-sm font-black tracking-[0.2em] uppercase mb-1`}>{selectedYear} Year — Queue</h3>
                            <p className="text-white/40 text-base font-medium">Pending your final review.</p>
                        </div>
                        <div className="flex items-end justify-between mt-8">
                            <span className="text-8xl font-black text-white">{pendingFinal.length}</span>
                            <span className={`px-4 py-1.5 ${t.ring} border ${t.border} rounded-full text-[12px] font-black ${t.text} uppercase`}>Active</span>
                        </div>
                    </div>

                    <div className="bg-[#0f1f38] border border-white/5 rounded-3xl p-8">
                        <FiTrendingUp className="text-emerald-400 mb-6" size={26} />
                        <p className="text-[12px] text-white/30 uppercase font-black tracking-widest mb-1">Approved ({selectedYear} Yr)</p>
                        <p className="text-5xl font-black text-white">{approvedCount}</p>
                    </div>

                    <div className={`bg-gradient-to-br ${t.ring} border ${t.border} rounded-3xl p-8`}>
                        <FiUsers className={`${t.text} mb-6`} size={26} />
                        <p className="text-[12px] text-white/30 uppercase font-black tracking-widest mb-1">Total {selectedYear} Year Forms</p>
                        <p className={`text-5xl font-black ${t.text}`}>{totalForYear}</p>
                    </div>
                </div>

                {/* ── Requests Table ── */}
                <div>
                    <div className="flex items-center justify-between px-1 mb-6">
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <FiFileText className={t.text} />
                            {view === "pending_final"
                                ? `${selectedYear} Year — Awaiting Final Signature`
                                : `${selectedYear} Year — Finalized Records`}
                        </h2>
                        <span className="text-xs text-white/20 font-bold">
                            {(view === "pending_final" ? pendingFinal : finalized).length} record{(view === "pending_final" ? pendingFinal : finalized).length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    <div className={`bg-[#0f1f38] border ${t.border} rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)]`}>
                        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-white/[0.03] text-[11px] uppercase tracking-[0.3em] font-black border-b border-white/5">
                                        <th className="px-6 py-6 text-white/40">Student</th>
                                        <th className="px-4 py-6 text-white/40 text-center">Reg No</th>
                                        <th className="px-4 py-6 text-white/40 text-center">Dept</th>
                                        <th className="px-4 py-6 text-white/40 text-center">Room</th>
                                        <th className="px-4 py-6 text-white/40 text-center">Leave Date</th>
                                        <th className="px-4 py-6 text-white/40 text-center">Arrival Date</th>
                                        <th className="px-4 py-6 text-white/40 text-center">Days</th>
                                        <th className="px-4 py-6 text-white/40">Reason</th>
                                        <th className="px-4 py-6 text-white/40 text-center">Status</th>
                                        <th className="px-6 py-6 text-white/40 text-right w-40">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {(view === "pending_final" ? pendingFinal : finalized).length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                                                        <FiFilter size={32} />
                                                    </div>
                                                    <p className="text-white/25 font-black uppercase tracking-widest text-sm">
                                                        No {view === "pending_final" ? "pending" : "finalized"} records for {selectedYear} Year
                                                    </p>
                                                    <p className="text-white/10 text-xs font-medium italic">
                                                        {view === "pending_final"
                                                            ? "Deputy Warden must approve requests first."
                                                            : "Approved/rejected records will appear here."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (view === "pending_final" ? pendingFinal : finalized).map((req, idx) => (
                                        <motion.tr
                                            layout
                                            key={req.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: idx * 0.04 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            {/* Student name + avatar */}
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl bg-[#0a1628] border ${t.border} flex items-center justify-center ${t.text} font-black text-lg shadow-inner group-hover:brightness-125 transition-all`}>
                                                        {req.name?.charAt(0) ?? "?"}
                                                    </div>
                                                    <p className={`text-base font-black text-white group-hover:${t.text} transition-colors`}>{req.name}</p>
                                                </div>
                                            </td>

                                            {/* Reg No */}
                                            <td className="px-4 py-6 text-center">
                                                <span className="text-sm font-bold text-white/40 font-mono tracking-tight">{req.id}</span>
                                            </td>

                                            {/* Dept */}
                                            <td className="px-4 py-6 text-center">
                                                <span className="px-4 py-1.5 bg-white/5 rounded-lg text-sm font-black text-white/50 border border-white/5 tracking-wider">{req.dept}</span>
                                            </td>

                                            {/* Room */}
                                            <td className="px-4 py-6 text-center">
                                                <span className="text-sm font-bold text-white/40">{req.room || "—"}</span>
                                            </td>

                                            {/* Leave Date */}
                                            <td className="px-4 py-6 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                                                        <span className="text-sm font-bold text-white/50">{req.leaveDate}</span>
                                                    </div>
                                                    <span className="text-[11px] text-white/20 font-medium">{req.leaveTime || ""}</span>
                                                </div>
                                            </td>

                                            {/* Arrival Date */}
                                            <td className="px-4 py-6 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-rose-500/60" />
                                                        <span className="text-sm font-bold text-white/50">{req.arrivalDate}</span>
                                                    </div>
                                                    <span className="text-[11px] text-white/20 font-medium">{req.arrivalTime || ""}</span>
                                                </div>
                                            </td>

                                            {/* Days */}
                                            <td className="px-4 py-6 text-center">
                                                <span className="text-base font-black text-white/80">{req.totalHolidays}</span>
                                            </td>

                                            {/* Reason */}
                                            <td className="px-4 py-6">
                                                <p className="text-sm font-medium text-white/40 leading-tight max-w-[150px] truncate">{req.reason}</p>
                                            </td>

                                            {/* Status badge */}
                                            <td className="px-4 py-5 text-center">
                                                <span className={`inline-flex px-3 py-1 rounded-xl border text-[9px] font-black uppercase tracking-widest ${
                                                    req.status === "approved_by_warden" || req.status === "fully_approved"
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : req.status === "final_rejected"
                                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                }`}>
                                                    {req.status === "accepted"           ? "Pending"         :
                                                     req.status === "approved_by_warden" ? "Approved"        :
                                                     req.status === "fully_approved"     ? "Office Done"     :
                                                     req.status === "final_rejected"     ? "Rejected"        : req.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-5 text-right">
                                                {view === "pending_final" ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleFinalAction(req.id, "approved_by_warden")}
                                                            className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-slate-900 transition-all duration-300 border border-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                                            title="Approve"
                                                        >
                                                            <FiCheck size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleFinalAction(req.id, "final_rejected")}
                                                            className="p-2.5 bg-rose-500/10 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all duration-300 border border-rose-500/10 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                                                            title="Reject"
                                                        >
                                                            <FiX size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleFinalAction(req.id, "accepted")}
                                                        className="px-3 py-1.5 text-[8px] font-black text-white/20 hover:text-teal-400 uppercase tracking-widest border border-white/5 rounded-xl hover:border-teal-500/30 transition-all"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Warden;
