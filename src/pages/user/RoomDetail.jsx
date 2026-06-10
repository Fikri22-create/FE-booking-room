import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById } from "../../services/roomService";

export default function RoomDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);

    const fetchRoom = useCallback(async () => {
        try {
            const res = await getRoomById(id);
            setRoom(res?.data || null);
        } catch (err) {
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        fetchRoom();
    }, [fetchRoom]);

    if (!room) return <div>Loading...</div>;

    return (
        <div className="bg-white p-6 rounded-3xl border">

            <h1 className="text-2xl font-bold">
                Room {room.room_number}
            </h1>

            <p className="text-slate-500">{room.description}</p>

            <p className="mt-2 font-bold text-emerald-600">
                Rp {Number(room.price_per_night).toLocaleString("id-ID")}
            </p>

            <button
                onClick={() => navigate(`/user/book/${room.id}`)}
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl"
            >
                Book Now
            </button>

        </div>
    );
}