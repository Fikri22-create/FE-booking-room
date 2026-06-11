import { useEffect, useMemo, useState } from "react";
import { getMyPayments } from "../../services/paymentService";
import {
    Wallet,
    Clock3,
    CheckCircle2,
    RotateCcw,
    Search,
    Eye
} from "lucide-react";
import { toast } from "../../components/Toast";

export default function MyPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedProof, setSelectedProof] =
        useState(null);
    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response =
                await getMyPayments();
            setPayments(
                response.data || []
            );
        } catch (error) {
            console.error(error);
            toast.error(
                "Failed to load payments"
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPayments();
    }, []);
    const filteredPayments =
        useMemo(() => {
            return payments.filter((p) => {
                const keyword =
                    search.toLowerCase();
                const matchSearch =
                    p.payment_code
                        ?.toLowerCase()
                        .includes(keyword);
                const matchStatus =
                    !statusFilter ||
                    p.status === statusFilter;
                return (
                    matchSearch &&
                    matchStatus
                );
            });
        }, [
            payments,
            search,
            statusFilter
        ]);
    const pending =
        payments.filter(
            (p) => p.status === "pending"
        ).length;
    const paid =
        payments.filter(
            (p) => p.status === "paid"
        ).length;
    const refunded =
        payments.filter(
            (p) => p.status === "refunded"
        ).length;
    const getStatusBadge = (
        status
    ) => {
        switch (status) {
            case "paid":
                return (
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700">Paid</span>
                );
            case "refunded":
                return (
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-100 text-rose-700">Refunded</span>
                );
            default:
                return (
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>
                );
        }
    };
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Payments</h1>
                <p className="text-sm text-slate-500 mt-1">View all your payment history.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-5">
                <StatCard
                    title="Total"
                    value={payments.length}
                    icon={
                        <Wallet size={20} />
                    }
                    color="blue"
                />
                <StatCard
                    title="Pending"
                    value={pending}
                    icon={
                        <Clock3 size={20} />
                    }
                    color="amber"
                />
                <StatCard
                    title="Paid"
                    value={paid}
                    icon={
                        <CheckCircle2
                            size={20}
                        />
                    }
                    color="emerald"
                />
                <StatCard
                    title="Refunded"
                    value={refunded}
                    icon={
                        <RotateCcw
                            size={20}
                        />
                    }
                    color="rose"
                />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex gap-3">
                <div className="relative flex-1">
                    <Search size={18}className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search payment..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl focus:outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                    className="border rounded-xl px-4"
                >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                </select>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left">Code</th>
                                <th className="px-6 py-4 text-left">Method</th>
                                <th className="px-6 py-4 text-left">Amount</th>
                                <th className="px-6 py-4 text-left">Proof</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6}className="py-10 text-center">Loading...</td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={6}className="py-10 text-center text-slate-500">No payments found</td>
                                </tr>
                            ) : (
                                filteredPayments.map(
                                    (
                                        payment
                                    ) => (
                                        <tr key={payment.id}className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium">{payment.payment_code}</td>
                                            <td className="px-6 py-4">{payment.payment_method?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                                            <td className="px-6 py-4 font-semibold">Rp{" "}{Number(payment.amount).toLocaleString("id-ID")}</td>
                                            <td className="px-6 py-4">
                                                {payment.proof_image ? (
                                                    <button
                                                        onClick={() =>
                                                            setSelectedProof(payment.proof_image)}className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs flex items-center gap-1">
                                                        <Eye size={14}/>
                                                        View
                                                    </button>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(payment.createdAt).toLocaleDateString("id-ID")}</td>
                                        </tr>
                                        )
                                    )
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedProof && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedProof(null)}
                >
                    <div
                        className="bg-white p-4 rounded-2xl max-w-3xl w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-slate-700">Payment Proof</p>
                            <button onClick={() => setSelectedProof(null)}className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition">✕</button>
                        </div>
                        <img src={`http://localhost:3000/uploads/${selectedProof}`}alt="Payment Proof"className="rounded-xl max-h-[75vh] w-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    color
}) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100"
    };
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex justify-between">
            <div>
                <p className="text-xs uppercase text-slate-500">{title}</p>
                <h2 className="text-2xl font-bold mt-1">{value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[color]}`}>{icon}</div>
        </div>
    );
}