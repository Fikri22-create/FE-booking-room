import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";

import {
    Hotel,
    User,
    Mail,
    Lock,
    UserPlus
} from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] =
        useState(false);
    const [form, setForm] =
        useState({
            name: "",
            email: "",
            password: ""
        });
    const submitHandler =
        async (e) => {
            e.preventDefault();
            try {
                setLoading(true);
                await registerUser(
                    form
                );
                alert(
                    "Register berhasil"
                );
                navigate(
                    "/login"
                );
            } catch (err) {
                alert(
                    err.response?.data
                        ?.message ||
                        "Register gagal"
                );
            } finally {
                setLoading(false);
            }
        };
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-xl grid lg:grid-cols-2">
                <div className="bg-slate-900 text-white p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <Hotel size={40} />
                        <div>
                            <h1 className="text-3xl font-bold">Booking Room</h1>
                            <p className="text-slate-300">Hotel Management System</p>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold leading-tight">Create Account 🚀</h2>
                    <p className="text-slate-300 mt-4">
                        Register to access
                        the hotel booking
                        management system
                        and start managing
                        rooms, bookings,
                        and payments.
                    </p>
                </div>
                <div className="p-10 lg:p-12">
                    <h2 className="text-3xl font-bold mb-2">Register</h2>
                    <p className="text-slate-500 mb-8">Create your account</p>
                    <form
                        onSubmit={
                            submitHandler
                        }
                        className="space-y-5"
                    >
                        <div>
                            <label className="block mb-2 text-sm font-medium">Full Name</label>
                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    required
                                    value={
                                        form.name
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                name:
                                                    e
                                                        .target
                                                        .value
                                            }
                                        )
                                    }
                                    placeholder="Enter your name"
                                    className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="email"
                                    required
                                    value={
                                        form.email
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                email:
                                                    e
                                                        .target
                                                        .value
                                            }
                                        )
                                    }
                                    placeholder="Enter your email"
                                    className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">Password</label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="password"
                                    required
                                    value={
                                        form.password
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                password:
                                                    e
                                                        .target
                                                        .value
                                            }
                                        )
                                    }
                                    placeholder="Minimum 6 characters"
                                    className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                        >
                            <UserPlus
                                size={18}
                            />
                            {loading
                                ? "Creating Account..."
                                : "Register"}
                        </button>
                    </form>
                    <p className="text-center text-slate-500 mt-6">
                        Already have an account?
                        <Link
                            to="/login"
                            className="text-slate-900 font-semibold ml-2"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}