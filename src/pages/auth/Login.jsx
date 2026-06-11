import { useState, useContext } from "react";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import {
    Hotel,
    Mail,
    Lock,
    LogIn
} from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const { login } =
        useContext(AuthContext);
    const [loading, setLoading] =
        useState(false);
    const [form, setForm] =
        useState({
            email: "",
            password: ""
        });
    const submitHandler =
        async (e) => {
            e.preventDefault();
            try {
                setLoading(true);
                const response =
                    await loginUser(
                        form
                    );
                if (
                    !response?.token ||
                    !response?.user
                ) {
                    throw new Error(
                        "Invalid login response"
                    );
                }
                login(
                    response.token,
                    response.user
                );
                if (
                    response.user
                        .role ===
                    "admin"
                ) {
                    navigate(
                        "/admin/dashboard"
                    );
                } else {
                    navigate("/user/rooms");
                }
            } catch (err) {
                alert(
                    err.response?.data
                        ?.message ||
                        err.message
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
                    <h2 className="text-4xl font-bold leading-tight">
                        Welcome Back
                    </h2>
                    <p className="text-slate-300 mt-4">
                        Manage bookings,
                        rooms, payments,
                        and monitor your
                        hotel performance
                        in one dashboard.
                    </p>
                </div>
                <div className="p-10 lg:p-12">
                    <h2 className="text-3xl font-bold mb-2">Login</h2>
                    <p className="text-slate-500 mb-8">Sign in to continue</p>
                    <form
                        onSubmit={
                            submitHandler
                        }
                        className="space-y-5"
                    >
                        <div>
                            <label className="block mb-2 text-sm font-medium">Email</label>
                            <div className="relative">
                                <Mail
                                    size={
                                        18
                                    }
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
                                    size={
                                        18
                                    }
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
                                    placeholder="Enter your password"
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
                            <LogIn
                                size={18}
                            />
                            {loading
                                ? "Signing In..."
                                : "Login"}
                        </button>
                    </form>
                    <p className="text-center text-slate-500 mt-6">
                        Don't have an account?
                        <Link
                            to="/register"
                            className="text-slate-900 font-semibold ml-2"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}