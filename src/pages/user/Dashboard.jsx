import { useEffect, useState } from "react";
import { getMyBookings } from "../../services/userBookingService";
import { BedDouble, CalendarCheck, Clock3 } from "lucide-react";

export default function UserDashboard() {
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        load();
    }, []);
    const load = async () => {
        const res = await getMyBookings();
        setBookings(res?.data || []);
    };
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === "pending").length;
    const approved = bookings.filter(b => b.status === "approved").length;
    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <p className="text-slate-500">Overview booking kamu</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                <Card
                    title="Total Bookings"
                    value={total}
                    icon={<BedDouble />}
                />

                <Card
                    title="Pending"
                    value={pending}
                    icon={<Clock3 />}
                />

                <Card
                    title="Approved"
                    value={approved}
                    icon={<CalendarCheck />}
                />

            </div>

        </div>
    );
}

function Card({ title, value, icon }) {
    return (
        <div className="bg-white p-6 rounded-3xl border shadow-sm flex justify-between">
            <div>
                <p className="text-slate-500">{title}</p>
                <h2 className="text-3xl font-bold mt-2">{value}</h2>
            </div>
            <div className="text-slate-900">{icon}</div>
        </div>
    );
}