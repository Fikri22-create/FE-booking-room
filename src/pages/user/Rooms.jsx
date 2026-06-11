import { useCallback, useEffect, useMemo, useState } from "react";
import { getRooms } from "../../services/roomService";
import { Link } from "react-router-dom";
import {
    BedDouble,
    Search,
    Users,
    ArrowRight
} from "lucide-react";

export default function UserRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const fetchRooms = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getRooms();
            setRooms(res?.data || []);
        } catch (err) {
            console.error(err);
            setRooms([]);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);
    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            const keyword = search.toLowerCase();
            return (
                room.room_number
                    ?.toString()
                    .toLowerCase()
                    .includes(keyword) ||
                room.room_type
                    ?.toLowerCase()
                    .includes(keyword)
            );
        });
    }, [rooms, search]);
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Available Rooms</h1>
                <p className="text-sm text-slate-500 mt-1">Browse and book available rooms.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                    title="Total Rooms"
                    value={rooms.length}
                    icon={<BedDouble size={20} />}
                    color="blue"
                />
                <StatCard
                    title="Available"
                    value={rooms.length}
                    icon={<BedDouble size={20} />}
                    color="emerald"
                />
                <StatCard
                    title="Room Types"
                    value={
                        new Set(
                            rooms.map((r) => r.room_type)
                        ).size
                    }
                    icon={<Users size={20} />}
                    color="amber"
                />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search room number or room type..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent focus:outline-none focus:bg-slate-50 text-sm"
                    />
                </div>
            </div>
            {loading ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse"
                        >
                            <div className="h-40 bg-slate-200 rounded-xl mb-4" />
                            <div className="h-5 bg-slate-200 rounded w-1/2 mb-2" />
                            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                            <div className="h-10 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <p className="font-semibold text-slate-700">No rooms found</p>
                    <p className="text-sm text-slate-500 mt-1">Try another keyword</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => {
                        const image =
                            room.gallery?.[0]?.image || room.image;
                        return (
                            <div
                                key={room.id}
                                className="
                                    bg-white
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    shadow-sm
                                    overflow-hidden
                                    hover:shadow-lg
                                    transition-all
                                    duration-300
                                "
                            >
                                <div className="h-52 bg-slate-100 overflow-hidden">
                                    {image ? (
                                        <img
                                            src={`http://localhost:3000/uploads/${image}`}
                                            alt={room.room_number}
                                            className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">Room {room.room_number}</h2>
                                            <p className="text-sm text-slate-500">{room.room_type}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Available</span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600"><Users size={15} />Capacity {room.capacity} Guests</div>
                                    <div className="mt-4">
                                        <p className="text-xs uppercase tracking-wider text-slate-400">Price Per Night</p>
                                        <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                                            Rp{" "}
                                            {Number(
                                                room.price_per_night
                                            ).toLocaleString("id-ID")}
                                        </h3>
                                    </div>
                                    <Link
                                        to={`/user/rooms/${room.id}`}
                                        className="
                                            mt-5
                                            w-full
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            bg-slate-900
                                            text-white
                                            py-3
                                            rounded-xl
                                            font-medium
                                            hover:bg-slate-800
                                            transition
                                        "
                                    >
                                        View Detail
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
function StatCard({ title, value, icon, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100"
    };
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex justify-between items-center shadow-sm">
            <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">{title}</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">{value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${colors[color]}`}>
                {icon}
            </div>
        </div>
    );
}