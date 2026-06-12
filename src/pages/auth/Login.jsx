import { useState, useContext } from "react";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "../../components/Toast";

import { RiHotelLine, RiMailLine, RiLockPasswordLine, RiLoginBoxLine, RiEyeLine, RiEyeOffLine, RiCheckboxCircleLine, RiShieldCheckLine, RiTimeLine } from "react-icons/ri";

export default function Login() {
    const navigate      = useNavigate();
    const { login }     = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw]   = useState(false);
    const [form, setForm]       = useState({ email: "", password: "" });

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await loginUser(form);
            if (!response?.token || !response?.user) throw new Error("Invalid login response");
            login(response.token, response.user);
            toast.success("Welcome back! Signing you in…");
            if (response.user.role === "admin") navigate("/admin/dashboard");
            else navigate("/user/rooms");
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8" style={{ background: "#0B0A08" }}>

            {/* ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[130px]"
                    style={{ background: "rgba(212,163,74,0.07)" }} />
                <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full blur-[130px]"
                    style={{ background: "rgba(212,163,74,0.05)" }} />
            </div>

            <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden grid lg:grid-cols-2 shadow-2xl"
                style={{ border: "1px solid rgba(212,163,74,0.15)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>

                {/* ── LEFT PANEL ── */}
                <div className="relative flex flex-col justify-between p-10 lg:p-14 overflow-hidden"
                    style={{ background: "#16130F" }}>

                    {/* decorative grid */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: "linear-gradient(rgba(212,163,74,1) 1px,transparent 1px),linear-gradient(90deg,rgba(212,163,74,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
                    {/* glow blob */}
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none"
                        style={{ background: "rgba(212,163,74,0.1)" }} />

                    {/* logo */}
                    <div className="relative flex items-center gap-3 mb-12">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[#0B0A08] text-xl shrink-0"
                            style={{ background: "linear-gradient(135deg,#D4A34A,#F0C96B)", boxShadow: "0 4px 20px rgba(212,163,74,0.3)" }}>
                            <RiHotelLine />
                        </div>
                        <div>
                            <p className="font-bold text-white text-[15px] leading-none">LuxeStay</p>
                            <p className="text-[11px] mt-0.5" style={{ color: "#D4A34A" }}>Premium Hotel</p>
                        </div>
                    </div>

                    {/* headline */}
                    <div className="relative flex-1 flex flex-col justify-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                            Welcome<br />
                            <span style={{ background: "linear-gradient(90deg,#D4A34A,#F0C96B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Back
                            </span>
                        </h2>
                        <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.38)" }}>
                            Manage bookings, rooms, and payments from one elegant dashboard.
                        </p>

                        {/* feature pills */}
                        <div className="flex flex-col gap-3">
                            {[
                                { icon: <RiCheckboxCircleLine className="text-base shrink-0" />, text: "Instant room booking" },
                                { icon: <RiShieldCheckLine    className="text-base shrink-0" />, text: "Secure & private" },
                                { icon: <RiTimeLine           className="text-base shrink-0" />, text: "24/7 availability" },
                            ].map((f, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-sm"
                                    style={{ color: "rgba(255,255,255,0.45)" }}>
                                    <span style={{ color: "#D4A34A" }}>{f.icon}</span>
                                    {f.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* bottom link */}
                    <div className="relative mt-12 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                        New here?{" "}
                        <Link to="/register" className="font-semibold transition-colors" style={{ color: "#D4A34A" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#F0C96B"}
                            onMouseLeave={e => e.currentTarget.style.color = "#D4A34A"}>
                            Create an account →
                        </Link>
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="flex flex-col justify-center p-10 lg:p-14" style={{ background: "#0B0A08" }}>

                    {/* header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-1">Sign In</h1>
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                            Enter your credentials to continue
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-5">

                        {/* email */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                                Email Address
                            </label>
                            <div className="relative">
                                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-base"
                                    style={{ color: "rgba(212,163,74,0.6)" }} />
                                <input
                                    type="email" required
                                    value={form.email} onChange={set("email")}
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all"
                                    style={{ background: "#16130F", border: "1px solid rgba(212,163,74,0.15)" }}
                                    onFocus={e => e.target.style.borderColor = "rgba(212,163,74,0.5)"}
                                    onBlur={e  => e.target.style.borderColor = "rgba(212,163,74,0.15)"}
                                />
                            </div>
                        </div>

                        {/* password */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                                Password
                            </label>
                            <div className="relative">
                                <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-base"
                                    style={{ color: "rgba(212,163,74,0.6)" }} />
                                <input
                                    type={showPw ? "text" : "password"} required
                                    value={form.password} onChange={set("password")}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-white/20 outline-none transition-all"
                                    style={{ background: "#16130F", border: "1px solid rgba(212,163,74,0.15)" }}
                                    onFocus={e => e.target.style.borderColor = "rgba(212,163,74,0.5)"}
                                    onBlur={e  => e.target.style.borderColor = "rgba(212,163,74,0.15)"}
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base transition-colors"
                                    style={{ color: "rgba(255,255,255,0.25)" }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#D4A34A"}
                                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>
                                    {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                                </button>
                            </div>
                        </div>

                        {/* submit */}
                        <button
                            type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 mt-2"
                            style={{
                                background: loading ? "rgba(212,163,74,0.5)" : "linear-gradient(135deg,#D4A34A,#F0C96B)",
                                color: "#0B0A08",
                                boxShadow: loading ? "none" : "0 6px 24px rgba(212,163,74,0.25)",
                                cursor: loading ? "not-allowed" : "pointer",
                            }}>
                            <RiLoginBoxLine className="text-base" />
                            {loading ? "Signing In…" : "Sign In"}
                        </button>
                    </form>

                    {/* divider */}
                    <div className="flex items-center gap-4 my-7">
                        <div className="flex-1 h-px" style={{ background: "rgba(212,163,74,0.1)" }} />
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>OR</span>
                        <div className="flex-1 h-px" style={{ background: "rgba(212,163,74,0.1)" }} />
                    </div>

                    <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold transition-colors" style={{ color: "#D4A34A" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#F0C96B"}
                            onMouseLeave={e => e.currentTarget.style.color = "#D4A34A"}>
                            Register
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
