import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, deleteRoom } from "../../services/roomService";
import {
    Plus,
    Search,
    BedDouble,
    Wrench,
    Users,
    Pencil,
    Trash2,
    Images,
    PackageOpen
} from "lucide-react";
import { toast } from "../../components/Toast";

export default function Rooms() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        totalPage: 1,
        totalData: 0
    });
    const fetchRooms = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getRooms({
                page,
                limit: 9,
                search
            });
            setRooms(response.data);
            setPagination({
                totalPage: response.totalPage,
                totalData: response.totalData
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load rooms data");
        } finally {
            setLoading(false);
        }
    }, [page, search]);
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);
    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this room?");
        if (!confirmed) return;
        try {
            await deleteRoom(id);
            toast.success("Room deleted successfully");
            fetchRooms();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to delete room");
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchTerm);
    };
    const availableRooms = rooms.filter((room) => room.status === "available").length;
    const maintenanceRooms = rooms.filter((room) => room.status === "maintenance").length;
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Rooms Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage hotel rooms, availability, and pricine</p>
                </div>
                <button
                    onClick={() => navigate("/admin/rooms/add")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm font-medium shadow-sm"
                >
                    <Plus size={18} />
                    Add New Room
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard title="Total Rooms" value={pagination.totalData} icon={<BedDouble size={20} />} color="blue" />
                <StatCard title="Available" value={availableRooms} icon={<Users size={20} />} color="emerald" />
                <StatCard title="Maintenance" value={maintenanceRooms} icon={<Wrench size={20} />} color="amber" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search room number or type..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-transparent focus:outline-none focus:bg-slate-50 transition-colors text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonRoomCard key={n} />)}
                </div>
            ) : rooms.length === 0 ? (
                <EmptyState search={search} />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out group flex flex-col"
                            >
                                <div className="h-48 bg-slate-100 relative overflow-hidden shrink-0">
                                    <img
                                        src={
                                            room.gallery?.[0]?.image
                                                ? `http://localhost:3000/uploads/${room.gallery[0].image}`
                                                : room.image
                                                ? `http://localhost:3000/uploads/${room.image}`
                                                : "https://placehold.co/600x400?text=No+Image"
                                        }
                                        alt={`Room ${room.room_number}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${
                                            room.status === "available"
                                                ? "bg-emerald-500/90 text-white shadow-sm"
                                                : "bg-amber-500/90 text-white shadow-sm"
                                        }`}>
                                            {room.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">Room {room.room_number}</h3>
                                            <p className="text-sm text-slate-500 capitalize mt-0.5">
                                                {room.room_type} Room
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 mb-6 flex-1">
                                        <p className="text-sm text-slate-600 flex items-center justify-between">
                                            <span>Capacity</span>
                                            <strong className="text-slate-900">{room.capacity} Guests</strong>
                                        </p>
                                        <p className="text-sm text-slate-600 flex items-center justify-between">
                                            <span>Price</span>
                                            <strong className="text-slate-900">
                                                Rp {Number(room.price_per_night).toLocaleString("id-ID")}
                                                <span className="text-xs text-slate-500 font-normal"> /night</span>
                                            </strong>
                                        </p>
                                    </div>
                                    <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => navigate(`/admin/rooms/gallery/${room.id}`)}
                                            className="flex-1 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-200 py-2 rounded-xl flex justify-center items-center transition-colors tooltip-trigger"
                                            title="Manage Gallery"
                                        >
                                            <Images size={16} />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}
                                            className="flex-1 bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 border border-slate-200 hover:border-amber-200 py-2 rounded-xl flex justify-center items-center transition-colors"
                                            title="Edit Room"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="flex-1 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 py-2 rounded-xl flex justify-center items-center transition-colors"
                                            title="Delete Room"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {pagination.totalPage > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-4">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                            >
                                Previous
                            </button>
                            <div className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-sm">
                                Page {page} of {pagination.totalPage}
                            </div>
                            <button
                                disabled={page >= pagination.totalPage}
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
function StatCard({ title, value, icon, color }) {
    const bgColors = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100"
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
function SkeletonRoomCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse flex flex-col h-[380px]">
            <div className="h-48 bg-slate-200 w-full shrink-0"></div>
            <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="space-y-2">
                    <div className="h-6 bg-slate-200 rounded-md w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
                </div>
                <div className="space-y-2 mt-2">
                    <div className="h-4 bg-slate-200 rounded-md w-full"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-full"></div>
                </div>
                <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                    <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
                    <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
                    <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
                </div>
            </div>
        </div>
    );
}
function EmptyState({ search }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="bg-white p-6 rounded-full mb-5 shadow-sm border border-slate-100">
                <PackageOpen size={48} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Rooms Found</h3>
            <p className="text-slate-500 max-w-md text-sm">
                {search 
                    ? `We couldn't find any rooms matching "${search}". Try adjusting your search keywords.` 
                    : "Your hotel currently has no rooms. Click 'Add New Room' to get started."}
            </p>
        </div>
    );
}