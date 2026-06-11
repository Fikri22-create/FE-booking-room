import { useEffect, useState } from "react";
import { getDashboardStats, getTopRooms } from "../../services/dashboardService";
import { BedDouble, Users, CalendarRange, Wallet, Clock3, CheckCircle2, XCircle, } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [topRooms, setTopRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ... (Logika fetchDashboard tetap sama persis seperti kode lu) ...
        const fetchDashboard = async () => {
            try {
                const dashboardRes = await getDashboardStats();
                const roomsRes = await getTopRooms();
                setStats(dashboardRes.data);
                setTopRooms(roomsRes.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-500 font-medium">Loading metrics...</p>
                </div>
            </div>
        );
    }

    if (!stats) return <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">Failed to load dashboard data.</div>;

    const months = ["", "Jan","Feb","Mar","Apr","May","Jun", "Jul","Aug","Sep","Oct","Nov","Dec"];
    const bookingChartData = stats?.bookingChart?.map((item) => ({
        month: months[item.month] || "-",
        total: Number(item.total || 0)
    })) || [];

    const topRoomsData = topRooms?.map((room) => ({
        room: room.Room?.room_number || `Room ${room.roomId}`,
        bookings: Number(room.bookingsCount || 0)
    })) || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* OVERVIEW CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card title="Total Revenue" value={`Rp ${(stats.totalRevenue || 0).toLocaleString("id-ID")}`} icon={<Wallet size={20} />} color="emerald" />
                <Card title="Total Rooms" value={stats.totalRooms} icon={<BedDouble size={20} />} color="blue" />
                <Card title="Total Users" value={stats.totalUsers} icon={<Users size={20} />} color="purple" />
                <Card title="Total Bookings" value={stats.totalBookings} icon={<CalendarRange size={20} />} color="orange" />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-900">Booking Trend</h3>
                        <p className="text-xs text-slate-500 mt-1">Approved bookings per month</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={bookingChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dx={-10} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Line type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-900">Top Rooms</h3>
                        <p className="text-xs text-slate-500 mt-1">Most booked rooms</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topRoomsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="room" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="bookings" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* STATUS CARDS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="font-bold text-slate-900 mb-5">Booking Status</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <StatusMiniCard title="Pending" value={stats.pendingBookings} icon={<Clock3 size={18}/>} color="amber" />
                        <StatusMiniCard title="Approved" value={stats.approvedBookings} icon={<CheckCircle2 size={18}/>} color="emerald" />
                        <StatusMiniCard title="Rejected" value={stats.rejectedBookings} icon={<XCircle size={18}/>} color="rose" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="font-bold text-slate-900 mb-5">Payment Analytics</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatusMiniCard title="Paid" value={stats.totalPaidPayments} color="emerald" />
                        <StatusMiniCard title="Pending" value={stats.totalPendingPayments} color="amber" />
                        <StatusMiniCard title="Failed" value={stats.totalFailedPayments} color="rose" />
                        <StatusMiniCard title="Refunded" value={stats.totalRefundedPayments} color="slate" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================= COMPACT COMPONENTS ================= */
function Card({ title, value, icon, color }) {
    const bgColors = {
        emerald: "bg-emerald-50 text-emerald-600",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600"
    };
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-colors">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">{value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColors[color]} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
        </div>
    );
}

function StatusMiniCard({ title, value, icon, color }) {
    const textColors = {
        amber: "text-amber-600", emerald: "text-emerald-600",
        rose: "text-rose-600", slate: "text-slate-600"
    };
    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
                {icon && <span className={textColors[color]}>{icon}</span>}
                <p className="text-xs font-medium text-slate-600">{title}</p>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{value}</h3>
        </div>
    );
}