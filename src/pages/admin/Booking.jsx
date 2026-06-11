import { useEffect, useMemo, useState } from "react";
import { getBookings, updateBookingStatus, exportBookingsExcel } from "../../services/bookingService";
import {
    CalendarRange,
    Clock3,
    CheckCircle2,
    XCircle,
    Search,
    Download,
    Loader2,
    FileQuestion
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [exporting, setExporting] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getBookings();
            setBookings(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch bookings data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatus = async (id, status) => {
        try {
            await updateBookingStatus(id, status);
            toast.success(`Booking successfully ${status}!`);
            fetchBookings();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update booking status");
        }
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            const response = await exportBookingsExcel();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            
            link.href = url;
            link.setAttribute("download", "bookings.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success("Export successful! Downloading...");
        } catch (error) {
            console.error(error);
            toast.error("Failed to export bookings");
        } finally {
            setExporting(false);
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const keyword = search.toLowerCase();
            return (
                booking.booking_code?.toLowerCase().includes(keyword) ||
                booking.User?.name?.toLowerCase().includes(keyword) ||
                booking.Room?.room_number?.toLowerCase().includes(keyword)
            );
        });
    }, [bookings, search]);

    const pending = bookings.filter((b) => b.status === "pending").length;
    const approved = bookings.filter((b) => b.status === "approved").length;
    const rejected = bookings.filter((b) => b.status === "rejected").length;

    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        A
                    </span>
                );
            case "rejected":
                return (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                        R
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                        P
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage and review customer reservations.
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={exporting || bookings.length === 0}
                    className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm font-medium shadow-sm"
                >
                    {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    Export Excel
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard title="Total Bookings" value={bookings.length} icon={<CalendarRange size={20} />} color="blue" />
                <StatCard title="Pending" value={pending} icon={<Clock3 size={20} />} color="amber" />
                <StatCard title="Approved" value={approved} icon={<CheckCircle2 size={20} />} color="emerald" />
                <StatCard title="Rejected" value={rejected} icon={<XCircle size={20} />} color="rose" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by booking code, user, or room..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-transparent focus:outline-none focus:bg-slate-50 transition-colors text-sm"
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Booking Code</th>
                                <th className="px-6 py-4">Guest</th>
                                <th className="px-6 py-4">Room</th>
                                <th className="px-6 py-4">Check In</th>
                                <th className="px-6 py-4">Check Out</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <SkeletonTableRows rows={5} cols={8} />
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <EmptyState search={search} />
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {booking.booking_code}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {booking.user?.name || "Unknown User"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            Room {booking.room?.room_number || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {booking.check_in}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {booking.check_out}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            Rp {Number(booking.total_price).toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/admin/bookings/${booking.id}`}
                                                    className="px-3 py-1.5 rounded-lg bg-slate-700 text-white text-xs hover:bg-slate-800"
                                                >
                                                    Detail
                                                </Link>
                                                {booking.status === "pending" ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleStatus(booking.id, "approved")}
                                                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 hover:border-emerald-500 transition-all text-xs font-semibold"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatus(booking.id, "rejected")}
                                                        className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-200 hover:border-rose-500 transition-all text-xs font-semibold"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <span className="text-slate-400 text-xs font-medium italic">
                                                        Resolved
                                                    </span>
                                                </div>
                                            )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* ================= COMPACT COMPONENTS ================= */

function StatCard({ title, value, icon, color }) {
    const bgColors = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100"
    };
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between group">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">{value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${bgColors[color]} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
        </div>
    );
}

function SkeletonTableRows({ rows, cols }) {
    return Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
            {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                </td>
            ))}
        </tr>
    ));
}

function EmptyState({ search }) {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-slate-50 p-4 rounded-full mb-3 border border-slate-100">
                <FileQuestion size={32} className="text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No Bookings Found</h3>
            <p className="text-slate-500 text-sm max-w-sm">
                {search 
                    ? `No records match the keyword "${search}".` 
                    : "There are currently no bookings available in the system."}
            </p>
        </div>
    );
}