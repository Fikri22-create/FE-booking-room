import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById } from "../../services/roomService";

import {
    BedDouble,
    Wallet,
    Users,
    Hotel,
    ArrowLeft
} from "lucide-react";

export default function RoomDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchRoom = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getRoomById(id);
            setRoom(res?.data || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);
    useEffect(() => {
        fetchRoom();
    }, [fetchRoom]);
    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-72 rounded-3xl bg-slate-200" />
                <div className="h-6 w-48 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
            </div>
        );
    }
    if (!room) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600">Room not found.</div>
        );
    }
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-3"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">Room {room.room_number}</h1>
                    <p className="text-slate-500 mt-1">{room.room_type}</p>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <img
                            src={
                                room.gallery?.length
                                    ? `http://localhost:3000/uploads/${room.gallery[selectedImage]?.image}`
                                    : "https://placehold.co/1200x700"
                            }
                            alt="Room"
                            className="w-full h-[420px] object-cover"
                        />
                        {room.gallery?.length > 1 && (
                            <div className="p-4 flex gap-3 overflow-x-auto">
                                {room.gallery.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() =>
                                            setSelectedImage(index)
                                        }
                                        className={`border-2 rounded-xl overflow-hidden shrink-0 transition ${
                                            selectedImage === index
                                                ? "border-slate-900"
                                                : "border-slate-200"
                                        }`}
                                    >
                                        <img src={`http://localhost:3000/uploads/${image.image}`}alt=""className="w-24 h-20 object-cover"/>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h2 className="font-bold text-lg text-slate-900 mb-4">Description</h2>
                        <p className="text-slate-600 leading-relaxed">{room.description || "No description available."}</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <p className="text-sm text-slate-500">Price Per Night</p>
                        <h2 className="text-3xl font-bold text-emerald-600 mt-2">Rp {Number(room.price_per_night).toLocaleString("id-ID")}</h2>
                        <button
                            onClick={() =>
                                navigate(`/user/book/${room.id}`)
                            }
                            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-medium transition"
                        >Book Now</button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Room Information</h3>
                        <div className="space-y-4">
                            <InfoItem
                                icon={<Hotel size={18} />}
                                label="Room Number"
                                value={room.room_number}
                            />
                            <InfoItem
                                icon={<BedDouble size={18} />}
                                label="Room Type"
                                value={room.room_type}
                            />
                            <InfoItem
                                icon={<Wallet size={18} />}
                                label="Price"
                                value={`Rp ${Number(
                                    room.price_per_night
                                ).toLocaleString("id-ID")}`}
                            />
                            <InfoItem
                                icon={<Users size={18} />}
                                label="Capacity"
                                value={
                                    room.capacity
                                        ? `${room.capacity} Guests`
                                        : "-"
                                }
                            />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Facilities</h3>                                
                        <div className="grid grid-cols-2 gap-3">                                
                            <div className="bg-slate-50 rounded-xl p-3 text-sm">Air Conditioner</div>
                            <div className="bg-slate-50 rounded-xl p-3 text-sm">Free WiFi</div>
                            <div className="bg-slate-50 rounded-xl p-3 text-sm">Smart TV</div>
                            <div className="bg-slate-50 rounded-xl p-3 text-sm">Bathroom</div>
                            <div className="bg-slate-50 rounded-xl p-3 text-sm">24h room service</div>
                            <div className="bg-slate-50 rounded-xl p-3 text-sm">In-Room Safe</div>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Availability</h3>
                        <span
                            className={`px-3 py-2 rounded-xl text-sm font-semibold ${
                                room.status === "available"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-rose-100 text-rose-700"
                            }`}
                        >
                            {room.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500">
                {icon}
                <span>{label}</span>
            </div>
            <span className="font-semibold text-slate-900">
                {value}
            </span>
        </div>
    );
}