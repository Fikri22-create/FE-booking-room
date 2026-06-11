import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMyBookings,
    cancelBooking
} from "../../services/userBookingService";

import {
    Clock3,
    CheckCircle2,
    XCircle,
    Search
} from "lucide-react";
import { toast } from "../../components/Toast";
export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const navigate = useNavigate();
    const load = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getMyBookings();
            setBookings(res.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        load();
    }, [load]);
    const handleCancel = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );
        if (!confirmed) return;
        try {
            await cancelBooking(id);
            toast.success("Booking cancelled");
            load();
        } catch (error) {
            console.error(error);
            toast.error("Failed to cancel booking");
        }
    };
    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const keyword = search.toLowerCase();
            const matchSearch =
                booking.booking_code
                    ?.toLowerCase()
                    .includes(keyword);
            const matchStatus =
                !statusFilter ||
                booking.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [bookings, search, statusFilter]);
    const pending =
        bookings.filter(
            (b) => b.status === "pending"
        ).length;
    const approved =
        bookings.filter(
            (b) => b.status === "approved"
        ).length;
    const rejected =
        bookings.filter(
            (b) => b.status === "rejected"
        ).length;
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    My Bookings
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage your booking history.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                    title="Pending"
                    value={pending}
                    icon={<Clock3 size={20} />}
                    color="amber"
                />
                <StatCard
                    title="Approved"
                    value={approved}
                    icon={<CheckCircle2 size={20} />}
                    color="emerald"
                />
                <StatCard
                    title="Rejected"
                    value={rejected}
                    icon={<XCircle size={20} />}
                    color="rose"
                />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex gap-3">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search booking code..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-transparent focus:outline-none focus:bg-slate-50 text-sm"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    className="px-4 py-2.5 rounded-xl border text-sm"
                >
                    <option value="All">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Booking Code</th>
                                <th className="px-6 py-4">Check In</th>
                                <th className="px-6 py-4">Check Out</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <SkeletonRows />
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-10"
                                    >
                                        <EmptyState />
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 font-medium">{booking.booking_code}</td>
                                        <td className="px-6 py-4">{booking.check_in}</td>
                                        <td className="px-6 py-4">{booking.check_out}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={booking.status}/></td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 justify-center">
                                                {booking.status === "approved" ? (
                                                    <div className="flex flex-col gap-1.5 items-center">
                                                        {!booking.payment ? (
                                                            <button
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/user/payment/${booking.id}`
                                                                    )
                                                                }
                                                                className="w-24 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition"
                                                            >
                                                                Pay Now
                                                            </button>
                                                        ) : (
                                                            <span className={`w-24 py-1.5 text-xs rounded-lg font-medium text-center ${
                                                                booking.payment.status === "paid"
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                            }`}>
                                                                {booking.payment.status === "paid" ? "✓ Paid" : "Verifying"}
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() =>
                                                                handleCancel(
                                                                    booking.id
                                                                )
                                                            }
                                                            className="w-24 py-1.5 text-xs bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        —
                                                    </span>
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
function StatusBadge({ status }) {
    switch (status) {
        case "approved":
            return (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-emerald-100 text-emerald-700">Approved</span>
            );
        case "rejected":
            return (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-rose-100 text-rose-700">Rejected</span>
            );
        default:
            return (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-amber-100 text-amber-700">Pending</span>
            );
    }
}
function StatCard({
    title,
    value,
    icon,
    color
}) {
    const colors = {
        emerald:"bg-emerald-50 text-emerald-600 border-emerald-100",
        amber:"bg-amber-50 text-amber-600 border-amber-100",
        rose:"bg-rose-50 text-rose-600 border-rose-100"
    };
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex justify-between">
            <div>
                <p className="text-xs text-slate-500 uppercase">{title}</p>
                <h2 className="text-2xl font-bold">{value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>{icon}</div>
        </div>
    );
}
function SkeletonRows() {
    return Array.from({ length: 5 }).map(
        (_, i) => (
            <tr
                key={i}
                className="animate-pulse"
            >
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded" /></td>
            </tr>
        )
    );
}

function EmptyState() {
    return (
        <div className="text-center py-10">
            <p className="font-bold">No Bookings Found</p>
            <p className="text-sm text-slate-500">You don't have any bookings yet.</p>
        </div>
    );
}