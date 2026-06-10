import { useCallback, useEffect, useState } from "react";
import { getRooms } from "../../services/roomService";
import { Link } from "react-router-dom";

export default function UserRooms() {
    const [rooms, setRooms] = useState([]);

    const fetchRooms = useCallback(async () => {
        try {
            const res = await getRooms();
            setRooms(res?.data || []);
        } catch (err) {
            console.error(err);
            setRooms([]);
        }
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    return (
        <div>
            <h1 className="text-3xl font-bold">Available Rooms</h1>
            <p className="text-slate-500 mb-6">Choose your stay</p>

            <div className="grid md:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition"
                    >
                        <h2 className="text-xl font-bold">
                            Room {room.room_number}
                        </h2>

                        <p className="text-slate-500">{room.room_type}</p>

                        <p className="mt-2">
                            Capacity: {room.capacity}
                        </p>

                        <p className="text-emerald-600 font-bold mt-2">
                            Rp {Number(room.price_per_night).toLocaleString("id-ID")}
                        </p>

                        <Link
                            to={`/user/rooms/${room.id}`}
                            className="block mt-5 bg-slate-900 text-white text-center py-3 rounded-2xl"
                        >
                            View Detail
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}