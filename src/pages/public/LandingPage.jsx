import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    Hotel, BedDouble, Users, CalendarCheck,
    ShieldCheck, CreditCard, ArrowRight, Star,
    Wifi, Wind, Tv, Bath, ChevronRight,
    Sparkles, Clock, Award, CheckCircle2, Menu, X,
} from "lucide-react";

const API = "http://localhost:3000/api";

function useCounter(target, duration = 1800, trigger) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!trigger || target === 0) return;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setVal(target); clearInterval(timer); }
            else setVal(start);
        }, 16);
        return () => clearInterval(timer);
    }, [target, trigger, duration]);
    return val;
}

function useVisible(threshold = 0.2) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}

export default function LandingPage() {
    const [rooms, setRooms]     = useState([]);
    const [stats, setStats]     = useState({ totalRooms: 0, totalBookings: 0, totalUsers: 0 });
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [mobileOpen, setMobileOpen]     = useState(false);
    const [scrolled, setScrolled]         = useState(false);

    const [statsRef, statsVisible] = useVisible();
    const roomsRef = useRef(null);

    const countRooms    = useCounter(stats.totalRooms,    1600, statsVisible);
    const countBookings = useCounter(stats.totalBookings, 1800, statsVisible);
    const countUsers    = useCounter(stats.totalUsers,    1700, statsVisible);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => {
        axios.get(`${API}/public/rooms`)
            .then(r => setRooms(r.data.data || []))
            .catch(() => setRooms([]))
            .finally(() => setLoadingRooms(false));

        axios.get(`${API}/public/stats`)
            .then(r => setStats(r.data.data || { totalRooms: 0, totalBookings: 0, totalUsers: 0 }))
            .catch(() => {});
    }, []);

    const scrollToRooms = () => roomsRef.current?.scrollIntoView({ behavior: "smooth" });

    return (
        <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "#0B0A08" }}>
            <header
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={scrolled ? { background: "rgba(11,10,8,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(212,163,74,0.12)" } : {}}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#0B0A08]"
                            style={{ background: "linear-gradient(135deg,#D4A34A,#F0C96B)" }}>
                            <Hotel size={17} strokeWidth={2.2} />
                        </div>
                        <div>
                            <span className="font-bold text-[15px] tracking-tight text-white">LuxeStay</span>
                            <span className="block text-[10px] -mt-0.5" style={{ color: "#D4A34A" }}>Premium Hotel</span>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <button onClick={scrollToRooms} className="hover:text-white transition-colors">Rooms</button>
                        <a href="#features"     className="hover:text-white transition-colors">Features</a>
                        <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
                    </nav>
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login"
                            className="px-5 py-2 text-sm rounded-xl transition-all"
                            style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,163,74,0.4)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                        >
                            Sign In
                        </Link>
                        <Link to="/register"
                            className="px-5 py-2 text-sm rounded-xl font-semibold text-[#0B0A08] transition-all hover:brightness-110"
                            style={{ background: "linear-gradient(135deg,#D4A34A,#F0C96B)", boxShadow: "0 4px 20px rgba(212,163,74,0.25)" }}
                        >
                            Get Started
                        </Link>
                    </div>
                    <button className="md:hidden" style={{ color: "rgba(255,255,255,0.6)" }} onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
                {mobileOpen && (
                    <div className="md:hidden px-6 py-5 flex flex-col gap-4 text-sm"
                        style={{ background: "#16130F", borderTop: "1px solid rgba(212,163,74,0.1)" }}>
                        <button onClick={() => { scrollToRooms(); setMobileOpen(false); }}
                            className="text-left transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>
                            Rooms
                        </button>
                        <a href="#features" onClick={() => setMobileOpen(false)}
                            className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>
                            Features
                        </a>
                        <a href="#testimonials" onClick={() => setMobileOpen(false)}
                            className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>
                            Reviews
                        </a>
                        <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />
                        <Link to="/login" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}>Sign In</Link>
                        <Link to="/register"
                            className="py-2.5 rounded-xl font-semibold text-center text-[#0B0A08]"
                            style={{ background: "linear-gradient(135deg,#D4A34A,#F0C96B)" }}>
                            Get Started
                        </Link>
                    </div>
                )}
            </header>
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full blur-[140px]"
                        style={{ background: "rgba(212,163,74,0.08)" }} />
                    <div className="absolute -bottom-32 -right-20 w-[450px] h-[450px] rounded-full blur-[140px]"
                        style={{ background: "rgba(212,163,74,0.06)" }} />
                    <div className="absolute inset-0 opacity-[0.025]"
                        style={{ backgroundImage: "linear-gradient(rgba(212,163,74,1) 1px,transparent 1px),linear-gradient(90deg,rgba(212,163,74,1) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
                    <div className="absolute bottom-0 left-0 right-0 h-px"
                        style={{ background: "linear-gradient(90deg,transparent,rgba(212,163,74,0.2),transparent)" }} />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 pt-36 pb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
                        style={{ background: "rgba(212,163,74,0.08)", border: "1px solid rgba(212,163,74,0.2)", color: "#D4A34A" }}>
                        <Sparkles size={13} />
                        Premium Hotel Experience
                    </div>
                    <h1 className="text-5xl md:text-[72px] font-bold leading-[1.08] tracking-tight mb-6">
                        Your Perfect Stay
                        <br />
                        <span style={{ background: "linear-gradient(90deg,#D4A34A,#F0C96B,#C8903A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Starts Here</span>
                    </h1>

                    <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
                        style={{ color: "rgba(255,255,255,0.42)" }}>
                        Discover luxury rooms, seamless booking, and an unforgettable experience.
                        Everything you need, all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register"
                            className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-[#0B0A08] transition-all duration-300 hover:scale-105"
                            style={{ background: "linear-gradient(135deg,#D4A34A,#F0C96B)", boxShadow: "0 8px 32px rgba(212,163,74,0.28)" }}>
                            Book Now
                            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button onClick={scrollToRooms}
                            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-medium transition-all duration-300"
                            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,163,74,0.35)"; e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
                            Explore Rooms
                            <ChevronRight size={17} />
                        </button>
                    </div>
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        {[
                            { icon: <Clock size={17}/>,      text: "24/7 Service",  sub: "Always available" },
                            { icon: <Award size={17}/>,      text: "Rated #1",      sub: "Best hotel 2025"  },
                            { icon: <ShieldCheck size={17}/>,text: "Verified",      sub: "Secure booking"   },
                        ].map((c, i) => (
                            <div key={i} className="flex items-center gap-3 px-5 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300"
                                style={{ background: "rgba(22,19,15,0.7)", border: "1px solid rgba(212,163,74,0.1)" }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,163,74,0.28)"}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(212,163,74,0.1)"}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(212,163,74,0.1)", color: "#D4A34A" }}>
                                    {c.icon}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-white">{c.text}</p>
                                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{c.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section ref={statsRef} className="py-20" style={{ background: "#16130F", borderTop: "1px solid rgba(212,163,74,0.08)", borderBottom: "1px solid rgba(212,163,74,0.08)" }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                        <StatItem value={countRooms}    suffix="+" label="Available Rooms"   icon={<BedDouble size={21}/>} />
                        <StatItem value={countBookings} suffix="+" label="Happy Bookings"    icon={<CalendarCheck size={21}/>} />
                        <StatItem value={countUsers}    suffix="+" label="Registered Guests" icon={<Users size={21}/>} />
                    </div>
                </div>
            </section>
            <section ref={roomsRef} className="py-24" style={{ background: "#0B0A08" }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                            style={{ background: "rgba(212,163,74,0.08)", border: "1px solid rgba(212,163,74,0.18)", color: "#D4A34A" }}>
                            Our Rooms
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Rooms Designed for{" "}
                            <span style={{ background: "linear-gradient(90deg,#D4A34A,#F0C96B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Comfort
                            </span>
                        </h2>
                        <p className="mt-4 max-w-lg mx-auto text-base" style={{ color: "rgba(255,255,255,0.35)" }}>
                            Carefully curated spaces where luxury meets home.
                        </p>
                    </div>
                    {loadingRooms ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1,2,3,4,5,6].map(n => (
                                <div key={n} className="rounded-3xl overflow-hidden animate-pulse" style={{ background: "#16130F" }}>
                                    <div className="h-56" style={{ background: "rgba(255,255,255,0.04)" }} />
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 rounded-lg w-2/3" style={{ background: "rgba(255,255,255,0.05)" }} />
                                        <div className="h-4 rounded-lg w-1/2" style={{ background: "rgba(255,255,255,0.05)" }} />
                                        <div className="h-10 rounded-xl mt-4" style={{ background: "rgba(255,255,255,0.05)" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center py-20" style={{ color: "rgba(255,255,255,0.25)" }}>
                            <BedDouble size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No rooms available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rooms.map(room => {
                                const img = room.gallery?.[0]?.image || room.image;
                                return <RoomCard key={room.id} room={room} img={img} />;
                            })}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/login"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-medium transition-all duration-300"
                            style={{ border: "1px solid rgba(212,163,74,0.2)", color: "rgba(212,163,74,0.7)" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,163,74,0.07)"; e.currentTarget.style.color = "#D4A34A"; e.currentTarget.style.borderColor = "rgba(212,163,74,0.4)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(212,163,74,0.7)"; e.currentTarget.style.borderColor = "rgba(212,163,74,0.2)"; }}>
                            View All Rooms
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
            <section id="features" className="py-24" style={{ background: "#16130F", borderTop: "1px solid rgba(212,163,74,0.06)" }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                            style={{ background: "rgba(212,163,74,0.08)", border: "1px solid rgba(212,163,74,0.18)", color: "#D4A34A" }}>
                            Why Choose Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Everything You{" "}
                            <span style={{ background: "linear-gradient(90deg,#D4A34A,#F0C96B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Need
                            </span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { icon: <BedDouble size={21}/>,     title: "Curated Rooms",    desc: "Each room is thoughtfully furnished with premium amenities and elegant décor." },
                            { icon: <CreditCard size={21}/>,    title: "Easy Payments",    desc: "Upload proof of payment and track verification status in real-time." },
                            { icon: <ShieldCheck size={21}/>,   title: "Secure & Private", desc: "Role-based access control keeps your data safe and your booking secure." },
                            { icon: <Clock size={21}/>,         title: "24/7 Support",     desc: "Our team is always here to help you, any time of day or night." },
                            { icon: <CalendarCheck size={21}/>, title: "Instant Booking",  desc: "Reserve your room in minutes with our streamlined booking process." },
                            { icon: <Award size={21}/>,         title: "Top Rated",        desc: "Consistently rated as the best hotel booking platform by our guests." },
                        ].map((f, i) => <FeatureCard key={i} {...f} />)}
                    </div>
                </div>
            </section>
            <section className="py-24" style={{ background: "#0B0A08", borderTop: "1px solid rgba(212,163,74,0.06)" }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
                                style={{ background: "rgba(212,163,74,0.08)", border: "1px solid rgba(212,163,74,0.18)", color: "#D4A34A" }}>
                                Room Facilities
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                                Premium Facilities
                                <br />
                                <span style={{ background: "linear-gradient(90deg,#D4A34A,#F0C96B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    In Every Room
                                </span>
                            </h2>
                            <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.38)" }}>
                                We believe luxury is in the details. Every room comes fully equipped
                                with modern amenities to make your stay exceptional.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: <Wifi size={16}/>,        text: "High-Speed WiFi"  },
                                    { icon: <Wind size={16}/>,        text: "Air Conditioning" },
                                    { icon: <Tv size={16}/>,          text: "Smart TV"         },
                                    { icon: <Bath size={16}/>,        text: "Private Bathroom" },
                                    { icon: <Clock size={16}/>,       text: "24h Room Service" },
                                    { icon: <ShieldCheck size={16}/>, text: "In-Room Safe"     },
                                ].map((f, i) => (
                                    <div key={i}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                                        style={{ background: "rgba(22,19,15,0.9)", border: "1px solid rgba(212,163,74,0.1)" }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,163,74,0.3)"}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(212,163,74,0.1)"}>
                                        <span style={{ color: "#D4A34A" }}>{f.icon}</span>
                                        <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>{f.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 rounded-3xl blur-3xl"
                                style={{ background: "radial-gradient(circle,rgba(212,163,74,0.08),transparent 70%)" }} />
                            <div className="relative grid grid-cols-2 gap-4">
                                {[
                                    { label: "Standard",   price: "From Rp 300K", note: "/ night",     highlight: false },
                                    { label: "Deluxe",     price: "From Rp 600K", note: "/ night",     highlight: true  },
                                    { label: "Suite",      price: "From Rp 1.4M", note: "/ night",     highlight: false },
                                    { label: "Free WiFi",  price: "& Breakfast",  note: "Included",    highlight: false },
                                ].map((item, i) => (
                                    <div key={i} className="p-5 rounded-2xl backdrop-blur-sm"
                                        style={item.highlight
                                            ? { background: "linear-gradient(135deg,rgba(212,163,74,0.15),rgba(240,201,107,0.06))", border: "1px solid rgba(212,163,74,0.35)" }
                                            : { background: "#16130F", border: "1px solid rgba(212,163,74,0.1)" }
                                        }>
                                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.label}</p>
                                        <p className="text-xl font-bold" style={item.highlight ? { color: "#F0C96B" } : { color: "white" }}>{item.price}</p>
                                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{item.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="testimonials" className="py-24" style={{ background: "#16130F", borderTop: "1px solid rgba(212,163,74,0.06)" }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                            style={{ background: "rgba(212,163,74,0.08)", border: "1px solid rgba(212,163,74,0.18)", color: "#D4A34A" }}>
                            Testimonials
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold">
                            What Our{" "}
                            <span style={{ background: "linear-gradient(90deg,#D4A34A,#F0C96B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Guests Say
                            </span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Muhammad", role: "Business Traveler", rating: 5, review: "Absolutely stunning experience! The room was immaculate and the booking process was incredibly smooth." },
                            { name: "Fikri", role: "Couple Getaway",    rating: 5, review: "Best hotel we've ever stayed at. The facilities were top-notch and the staff was incredibly welcoming." },
                            { name: "Alfarizi",  role: "Solo Traveler",     rating: 5, review: "I loved how easy it was to book and the payment verification was quick. Will definitely come back!" },
                        ].map((t, i) => (
                            <div key={i}
                                className="p-6 rounded-3xl transition-all duration-300 group"
                                style={{ background: "#0B0A08", border: "1px solid rgba(212,163,74,0.1)" }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,163,74,0.28)"}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(212,163,74,0.1)"}>
                                <div className="flex items-center gap-0.5 mb-4">
                                    {Array(t.rating).fill(0).map((_, j) => (
                                        <Star key={j} size={13} style={{ fill: "#D4A34A", color: "#D4A34A" }} />
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                                    "{t.review}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#0B0A08]"
                                        style={{ background: "linear-gradient(135deg,#D4A34A,#F0C96B)" }}>
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{t.name}</p>
                                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-24" style={{ background: "#0B0A08", borderTop: "1px solid rgba(212,163,74,0.06)" }}>
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="relative p-12 md:p-16 rounded-3xl overflow-hidden"
                        style={{ border: "1px solid rgba(212,163,74,0.2)", background: "linear-gradient(135deg,rgba(22,19,15,0.9),rgba(11,10,8,0.95))" }}>
                        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                            style={{ background: "rgba(212,163,74,0.1)" }} />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                            style={{ background: "rgba(212,163,74,0.07)" }} />
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
                                style={{ background: "rgba(212,163,74,0.08)", border: "1px solid rgba(212,163,74,0.18)", color: "rgba(212,163,74,0.9)" }}>
                                <CheckCircle2 size={13} />
                                Ready to Book?
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Start Your{" "}
                                <span style={{ background: "linear-gradient(90deg,#D4A34A,#F0C96B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Journey
                                </span>{" "}
                                Today
                            </h2>
                            <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.38)" }}>
                                Join thousands of happy guests. Create your account and book your dream room in minutes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register"
                                    className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-[#0B0A08] transition-all duration-300 hover:scale-105 hover:brightness-110"
                                    style={{ background: "linear-gradient(135deg,#D4A34A,#F0C96B)", boxShadow: "0 8px 32px rgba(212,163,74,0.25)" }}>
                                    Create Free Account
                                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/login"
                                    className="flex items-center justify-center px-8 py-4 rounded-2xl font-medium transition-all duration-300"
                                    style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,163,74,0.3)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="py-12" style={{ background: "#0D0B09", borderTop: "1px solid rgba(212,163,74,0.08)" }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0B0A08]"
                                style={{ background: "linear-gradient(135deg,#D4A34A,#F0C96B)" }}>
                                <Hotel size={14} />
                            </div>
                            <div>
                                <span className="font-bold text-white text-sm">LuxeStay</span>
                                <span className="block text-[10px] -mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>Premium Hotel</span>
                            </div>
                        </div>
                        <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.18)" }}>
                            © {new Date().getFullYear()} LuxeStay. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm" style={{ color: "rgba(255,255,255,0.28)" }}>
                            <Link to="/login"    className="transition-colors hover:text-white">Sign In</Link>
                            <Link to="/register" className="transition-colors hover:text-white">Register</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
function StatItem({ value, suffix, label, icon }) {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(212,163,74,0.1)", border: "1px solid rgba(212,163,74,0.2)", color: "#D4A34A" }}>
                {icon}
            </div>
            <div className="text-5xl font-bold" style={{ background: "linear-gradient(90deg,#fff,rgba(255,255,255,0.55))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {value.toLocaleString()}{suffix}
            </div>
            <p className="text-sm font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
                {label}
            </p>
        </div>
    );
}
function RoomCard({ room, img }) {
    const badgeStyle = {
        suite:    { background: "rgba(212,163,74,0.15)", border: "1px solid rgba(212,163,74,0.3)", color: "#F0C96B" },
        deluxe:   { background: "rgba(180,130,50,0.15)", border: "1px solid rgba(180,130,50,0.3)", color: "#D4A34A" },
        standard: { background: "rgba(150,115,60,0.15)", border: "1px solid rgba(150,115,60,0.3)", color: "#C8903A" },
    };
    const bs = badgeStyle[room.room_type] || badgeStyle.standard;

    return (
        <div className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
            style={{ background: "#16130F", border: "1px solid rgba(212,163,74,0.1)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,163,74,0.3)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(212,163,74,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,163,74,0.1)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div className="relative h-56 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                {img ? (
                    <img
                        src={`http://localhost:3000/uploads/${img}`}
                        alt={`Room ${room.room_number}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={e => { e.target.style.display = "none"; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: "rgba(255,255,255,0.08)" }}>
                        <BedDouble size={52} />
                    </div>
                )}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top,#16130F 0%,transparent 60%)" }} />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md" style={bs}>
                    {room.room_type}
                </span>
            </div>
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-bold text-lg text-white">Room {room.room_number}</h3>
                        <p className="text-sm flex items-center gap-1.5 mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                            <Users size={12} />
                            Up to {room.capacity} guests
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>per night</p>
                        <p className="text-lg font-bold" style={{ color: "#D4A34A" }}>
                            Rp {Number(room.price_per_night).toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
                {room.description && (
                    <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: "rgba(255,255,255,0.28)" }}>
                        {room.description}
                    </p>
                )}
                <Link to="/login"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                    style={{ background: "rgba(212,163,74,0.07)", border: "1px solid rgba(212,163,74,0.18)", color: "rgba(212,163,74,0.75)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,163,74,0.14)"; e.currentTarget.style.color = "#D4A34A"; e.currentTarget.style.borderColor = "rgba(212,163,74,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(212,163,74,0.07)"; e.currentTarget.style.color = "rgba(212,163,74,0.75)"; e.currentTarget.style.borderColor = "rgba(212,163,74,0.18)"; }}>
                    Book This Room
                    <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 group"
            style={{ background: "#0B0A08", border: "1px solid rgba(212,163,74,0.1)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,163,74,0.28)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(212,163,74,0.1)"}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                style={{ background: "rgba(212,163,74,0.08)", border: "1px solid rgba(212,163,74,0.15)", color: "#D4A34A" }}>
                {icon}
            </div>
            <h3 className="font-bold text-white mb-2">{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{desc}</p>
        </div>
    );
}
