import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Users,
    MessageSquare,
    BedDouble,
    Loader2
} from "lucide-react";
import toast from "react-hot-toast";

import { getRoomById } from "../../services/roomService";
import { createBooking } from "../../services/userBookingService";

export default function BookingForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        check_in: "",
        check_out: "",
        guest_count: 1,
        special_request: ""
    });

    const loadRoom = useCallback(async () => {
        try {
            const res = await getRoomById(id);
            setRoom(res?.data || null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load room");
        }
    }, [id]);

    useEffect(() => {
        loadRoom();
    }, [loadRoom]);

    const nights =
        form.check_in && form.check_out
            ? Math.max(
                0,
                Math.ceil(
                    (new Date(form.check_out) -
                        new Date(form.check_in)) /
                    86400000
                )
            )
            : 0;

    const total =
        nights * (room?.price_per_night || 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.check_in || !form.check_out) {
            return toast.error(
                "Please select check in and check out date"
            );
        }

        if (nights <= 0) {
            return toast.error(
                "Check out date must be after check in"
            );
        }

        try {
            setLoading(true);

            await createBooking({
                roomId: room.id,
                ...form
            });

            toast.success(
                "Booking created successfully"
            );

            navigate("/user/my-bookings");
        } catch (error) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to create booking"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!room) {
        return (
            <div className="h-72 flex justify-center items-center">
                <Loader2
                    size={30}
                    className="animate-spin text-slate-500"
                />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Book Room
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    Complete your booking information.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* FORM */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* CHECK IN */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Check In
                            </label>

                            <div className="relative">
                                <CalendarDays
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="date"
                                    value={form.check_in}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            check_in:
                                                e.target.value
                                        })
                                    }
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>

                        {/* CHECK OUT */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Check Out
                            </label>

                            <div className="relative">
                                <CalendarDays
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="date"
                                    value={form.check_out}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            check_out:
                                                e.target.value
                                        })
                                    }
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>

                        {/* GUEST */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Guest Count
                            </label>

                            <div className="relative">
                                <Users
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="number"
                                    min="1"
                                    value={form.guest_count}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            guest_count: Math.max(
                                                1,
                                                Number(e.target.value)
                                            )
                                        })
                                    }
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>

                        {/* REQUEST */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Special Request
                            </label>

                            <div className="relative">
                                <MessageSquare
                                    size={18}
                                    className="absolute left-3 top-4 text-slate-400"
                                />

                                <textarea
                                    rows={4}
                                    value={
                                        form.special_request
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            special_request:
                                                e.target.value
                                        })
                                    }
                                    placeholder="Additional notes..."
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                bg-slate-900
                                hover:bg-slate-800
                                text-white
                                py-3
                                rounded-xl
                                font-medium
                                transition
                                disabled:opacity-50
                            "
                        >
                            {loading ? (
                                <span className="flex justify-center items-center gap-2">
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Processing...
                                </span>
                            ) : (
                                "Confirm Booking"
                            )}
                        </button>

                    </form>

                </div>

                {/* SIDEBAR */}
                <div className="space-y-5">

                    {/* ROOM CARD */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                        <div className="p-5">

                            <div className="flex items-center gap-2 mb-4">
                                <BedDouble size={18} />
                                <h3 className="font-bold">
                                    Room Information
                                </h3>
                            </div>

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Room Number
                                    </span>

                                    <span className="font-medium">
                                        {room.room_number}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Type
                                    </span>

                                    <span className="font-medium">
                                        {room.room_type}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Price
                                    </span>

                                    <span className="font-bold text-emerald-600">
                                        Rp{" "}
                                        {Number(
                                            room.price_per_night
                                        ).toLocaleString(
                                            "id-ID"
                                        )}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* SUMMARY */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

                        <h3 className="font-bold text-slate-900 mb-4">
                            Booking Summary
                        </h3>

                        <div className="space-y-3 text-sm">

                            <div className="flex justify-between">
                                <span>Nights</span>
                                <span>{nights}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Price / Night</span>
                                <span>
                                    Rp{" "}
                                    {Number(
                                        room.price_per_night
                                    ).toLocaleString(
                                        "id-ID"
                                    )}
                                </span>
                            </div>

                            <hr />

                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>

                                <span className="text-emerald-600">
                                    Rp{" "}
                                    {Number(total).toLocaleString(
                                        "id-ID"
                                    )}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}