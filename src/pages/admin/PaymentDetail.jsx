import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPaymentById } from "../../services/paymentService";
import toast from "react-hot-toast";

export default function PaymentDetail() {
    const { id } = useParams();

    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPayment = async () => {
        try {
            setLoading(true);

            const response = await getPaymentById(id);

            setPayment(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch payment");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayment();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-72">
                Loading...
            </div>
        );
    }

    if (!payment) {
        return (
            <div className="text-center py-20">
                Payment not found
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-3">
                <Link
                    to="/admin/payments"
                    className="p-2 rounded-lg border"
                >
                    <ArrowLeft size={18} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold">
                        Payment Detail
                    </h1>

                    <p className="text-sm text-slate-500">
                        Complete payment information
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">

                <div className="grid md:grid-cols-2 gap-6">

                    <Info
                        label="Payment Code"
                        value={payment.payment_code}
                    />

                    <Info
                        label="Status"
                        value={payment.status}
                    />

                    <Info
                        label="Amount"
                        value={`Rp ${Number(
                            payment.amount
                        ).toLocaleString("id-ID")}`}
                    />

                    <Info
                        label="Method"
                        value={payment.payment_method}
                    />

                    <Info
                        label="User"
                        value={payment.booking?.user?.name}
                    />

                    <Info
                        label="Email"
                        value={payment.booking?.user?.email}
                    />

                    <Info
                        label="Room"
                        value={`Room ${payment.booking?.room?.room_number}`}
                    />

                    <Info
                        label="Booking Code"
                        value={payment.booking?.booking_code}
                    />
                </div>

            </div>

            {payment.proof_image && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h2 className="font-semibold mb-4">
                        Payment Proof
                    </h2>

                    <img
                        src={`http://localhost:3000/uploads/${payment.proof_image}`}
                        alt="proof"
                        className="rounded-xl border max-h-[600px]"
                    />
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