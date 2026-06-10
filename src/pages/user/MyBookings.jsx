import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../../services/userBookingService";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    const load = useCallback(async () => {
        const res = await getMyBookings();
        setBookings(res.data || []);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const cancel = async (id) => {
        await cancelBooking(id);
        load();
    };

    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">My Bookings</h1>

            <div className="bg-white rounded-3xl shadow overflow-hidden">

                <table className="w-full">

                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.id} className="border-t">

                                <td className="p-4">{b.booking_code}</td>
                                <td>{b.check_in}</td>
                                <td>{b.check_out}</td>
                                <td>{b.status}</td>

                                <td className="p-4 flex gap-2">

                                    <button
                                        onClick={() => cancel(b.id)}
                                        className="bg-red-500 text-white px-3 py-2 rounded-xl"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => navigate(`/user/payment/${b.id}`)}
                                        className="bg-green-600 text-white px-3 py-2 rounded-xl"
                                    >
                                        Pay
                                    </button>

                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    );
}