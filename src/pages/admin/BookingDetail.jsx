import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getBookingById } from "../../services/bookingService";
import toast from "react-hot-toast";

export default function BookingDetail() {
    const { id } = useParams();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBooking = async () => {
        try {
            setLoading(true);

            const response = await getBookingById(id);

            setBooking(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch booking");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-72">
                Loading...
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="text-center py-20">
                Booking not found
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-3">
                <Link
                    to="/admin/bookings"
                    className="p-2 border rounded-lg"
                >
                    <ArrowLeft size={18} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold">
                        Booking Detail
                    </h1>

                    <p className="text-sm text-slate-500">
                        Complete booking information
                    </p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <div className="grid md:grid-cols-2 gap-6">

                    <Info
                        label="Booking Code"
                        value={booking.booking_code}
                    />

                    <Info
                        label="Status"
                        value={booking.status}
                    />

                    <Info
                        label="Guest Name"
                        value={booking.user?.name}
                    />

                    <Info
                        label="Email"
                        value={booking.user?.email}
                    />

                    <Info
                        label="Room"
                        value={`Room ${booking.room?.room_number}`}
                    />

                    <Info
                        label="Room Type"
                        value={`${booking.room?.room_type}`}
                    />

                    <Info
                        label="Check In"
                        value={new Date(
                            booking.check_in
                        ).toLocaleDateString("id-ID")}
                    />

                    <Info
                        label="Check Out"
                        value={new Date(
                            booking.check_out
                        ).toLocaleDateString("id-ID")}
                    />

                    <Info
                        label="Total Price"
                        value={`Rp ${Number(
                            booking.total_price
                        ).toLocaleString("id-ID")}`}
                    />

                    <Info
                        label="Created At"
                        value={new Date(
                            booking.createdAt
                        ).toLocaleDateString("id-ID")}
                    />
                </div>

            </div>

            {booking.Payment && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <h2 className="font-semibold mb-4">
                        Payment Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <Info
                            label="Payment Code"
                            value={booking.Payment.payment_code}
                        />

                        <Info
                            label="Payment Status"
                            value={booking.Payment.status}
                        />

                        <Info
                            label="Method"
                            value={booking.Payment.payment_method}
                        />

                        <Info
                            label="Amount"
                            value={`Rp ${Number(
                                booking.Payment.amount
                            ).toLocaleString("id-ID")}`}
                        />

                    </div>

                </div>
            )}
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-xs uppercase text-slate-400 mb-1">
                {label}
            </p>

            <p className="font-medium text-slate-900">
                {value || "-"}
            </p>
        </div>
    );
}