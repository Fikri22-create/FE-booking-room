import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById } from "../../services/roomService";
import { createBooking } from "../../services/userBookingService";

export default function BookingForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [form, setForm] = useState({
        check_in: "",
        check_out: "",
        guest_count: 1,
        special_request: ""
    });

    const loadRoom = useCallback(async () => {
        const res = await getRoomById(id);
        setRoom(res?.data);
    }, [id]);

    useEffect(() => {
        loadRoom();
    }, [loadRoom]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createBooking({
            roomId: room.id,
            ...form
        });

        navigate("/user/my-bookings");
    };

    const nights =
        form.check_in && form.check_out
            ? (new Date(form.check_out) - new Date(form.check_in)) / 86400000
            : 0;

    const total = nights * (room?.price_per_night || 0);

    if (!room) return <div>Loading...</div>;

    return (
        <div className="bg-white p-6 rounded-3xl border max-w-2xl">

            <h1 className="text-2xl font-bold mb-4">
                Booking Room {room.room_number}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input type="date" name="check_in"
                    className="w-full p-3 border rounded-xl"
                    onChange={(e)=>setForm({...form, check_in:e.target.value})}
                />

                <input type="date" name="check_out"
                    className="w-full p-3 border rounded-xl"
                    onChange={(e)=>setForm({...form, check_out:e.target.value})}
                />

                <input type="number"
                    className="w-full p-3 border rounded-xl"
                    value={form.guest_count}
                    onChange={(e)=>setForm({...form, guest_count:e.target.value})}
                />

                <textarea
                    className="w-full p-3 border rounded-xl"
                    onChange={(e)=>setForm({...form, special_request:e.target.value})}
                />

                <div className="bg-slate-100 p-4 rounded-xl">
                    <p>Nights: {nights}</p>
                    <p className="font-bold">Total: Rp {total}</p>
                </div>

                <button className="w-full bg-blue-600 text-white p-3 rounded-xl">
                    Book Now
                </button>

            </form>
        </div>
    );
}