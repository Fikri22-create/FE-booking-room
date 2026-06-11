import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    UploadCloud,
    CreditCard,
    ImageIcon,
    Loader2
} from "lucide-react";
import api from "../../services/api";
import { toast } from "../../components/Toast";

export default function PaymentUpload() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [method, setMethod] = useState("credit_card");
    const [loading, setLoading] = useState(false);
    const handleFile = (selectedFile) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };
    const submit = async (e) => {
        e.preventDefault();
        if (!file) {
            return toast.error("Please upload payment proof");
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("bookingId", bookingId);
            formData.append("payment_method", method);
            formData.append("proof_image", file);
            await api.post("/payments", formData);
            toast.success("Payment submitted successfully");
            navigate("/user/payments");
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message ||
                "Failed to upload payment"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Upload Payment</h1>
                <p className="text-sm text-slate-500 mt-1">Submit your payment proof for booking verification.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <form onSubmit={submit}className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
                            <div className="relative">
                                <CreditCard
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <select
                                    value={method}
                                    onChange={(e) =>
                                        setMethod(e.target.value)
                                    }
                                    className="
                                        w-full
                                        pl-10
                                        pr-4
                                        py-3
                                        border
                                        border-slate-200
                                        rounded-xl
                                        text-sm
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-slate-900
                                    "
                                >
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="credit_card">Credit Card</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Proof</label>
                            <label
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    border-2
                                    border-dashed
                                    border-slate-300
                                    rounded-2xl
                                    p-10
                                    cursor-pointer
                                    hover:border-slate-500
                                    transition
                                "
                            >
                                <UploadCloud
                                    size={42}
                                    className="text-slate-400 mb-3"
                                />
                                <p className="font-medium text-slate-700">Click to upload</p>
                                <p className="text-xs text-slate-500 mt-1">JPG, PNG, JPEG</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) =>
                                        handleFile(
                                            e.target.files[0]
                                        )
                                    }
                                />
                            </label>
                        </div>
                        {preview && (
                            <div>
                                <h3 className="font-semibold text-slate-700 mb-3">Preview</h3>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="
                                        w-full
                                        h-72
                                        object-cover
                                        rounded-2xl
                                        border
                                    "
                                />
                            </div>
                        )}
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
                                    Uploading...
                                </span>
                            ) : (
                                "Submit Payment"
                            )}
                        </button>
                    </form>
                </div>
                <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-bold text-slate-900 mb-4">Booking Information</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Booking ID</span>
                                <span className="font-semibold">#{bookingId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status</span>
                                <span className="text-amber-600 font-semibold">Pending Verification</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-bold text-slate-900 mb-4">Payment Guide</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li>• Complete payment according to your booking amount.</li>
                            <li>• Upload transfer receiptclearly.</li>
                            <li>• Admin will verify yourpayment manually.</li>
                            <li>• Verification usually takesless than 24 hours.</li>
                        </ul>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                        <div className="flex gap-3">
                            <ImageIcon
                                size={20}
                                className="text-blue-600 mt-0.5"
                            />
                            <div>
                                <p className="font-semibold text-blue-700">Upload Tips</p>
                                <p className="text-sm text-blue-600 mt-1">Make sure the payment proof image is clear andreadable.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}