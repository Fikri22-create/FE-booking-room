import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function PaymentUpload() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [method, setMethod] = useState("transfer");

    const submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("bookingId", bookingId);
        formData.append("payment_method", method);
        formData.append("proof_image", file);

        await api.post("/payments", formData);

        navigate("/user/bookings");
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl shadow">

            <h1 className="text-2xl font-bold mb-6">Upload Payment</h1>

            <form onSubmit={submit} className="space-y-4">

                <select
                    className="w-full border p-3 rounded-xl"
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <option value="transfer">Transfer</option>
                    <option value="cash">Cash</option>
                </select>

                <input
                    type="file"
                    className="w-full border p-3 rounded-xl"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <button className="w-full bg-green-600 text-white py-3 rounded-xl">
                    Submit Payment
                </button>

            </form>

        </div>
    );
}