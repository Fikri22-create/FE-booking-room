import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BedDouble, CalendarRange, Wallet, Users, Hotel, ChevronRight } from "lucide-react";

export default function Sidebar({ role }) {
    const location = useLocation();
    const adminMenus = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { name: "Rooms", icon: BedDouble, path: "/admin/rooms" },
        { name: "Bookings", icon: CalendarRange, path: "/admin/bookings" },
        { name: "Payments", icon: Wallet, path: "/admin/payments" },
        { name: "Users", icon: Users, path: "/admin/users" }
    ];
    const userMenus = [
        { name: "Rooms", icon: BedDouble, path: "/user/rooms" },
        { name: "My Bookings", icon: CalendarRange, path: "/user/my-bookings" },
        { name: "My Payments", icon: Wallet, path: "/user/payments" }
    ];
    const menus =
        role === "admin"
            ? adminMenus
            : userMenus;

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
            <div className="h-20 px-6 flex items-center border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                        <Hotel size={24} className="text-slate-500" />  
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-900 tracking-tight leading-none">Roomora</h1>

                        <p
                            className="
                            text-[10px]
                            uppercase
                            tracking-[0.18em]
                            text-slate-400
                            font-semibold
                            mt-1
                            "
                        >
                            Hotel Management
                        </p>
                    </div>

                </div>

            </div>

            {/* MENU */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">

                <p
                    className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                    px-3
                    mb-3
                    "
                >
                    Main Menu
                </p>

                <div className="space-y-1.5">

                    {menus.map((menu) => {
                        const Icon = menu.icon;

                        const active =
                            location.pathname.startsWith(
                                menu.path
                            );

                        return (
                            <Link
                                key={menu.path}
                                to={menu.path}
                                className={`
                                    group
                                    relative
                                    flex
                                    items-center
                                    justify-between
                                    px-3.5
                                    py-2.5
                                    rounded-xl
                                    text-sm
                                    font-medium
                                    transition-all
                                    duration-200
                                    select-none

                                    ${
                                        active
                                            ? "bg-slate-100 text-slate-900 font-semibold"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }
                                `}
                            >
                                {active && (
                                    <div
                                        className="
                                        absolute
                                        left-0
                                        top-3
                                        bottom-3
                                        w-1
                                        bg-slate-900
                                        rounded-r-md
                                        "
                                    />
                                )}

                                <div className="flex items-center gap-3">

                                    <Icon
                                        size={18}
                                        className={`
                                            shrink-0
                                            transition-all
                                            duration-200
                                            group-hover:scale-105
                                            ${
                                                active
                                                    ? "text-slate-900 stroke-[2.2]"
                                                    : "text-slate-400 group-hover:text-slate-600"
                                            }
                                        `}
                                    />

                                    <span>
                                        {menu.name}
                                    </span>

                                </div>

                                <ChevronRight
                                    size={14}
                                    className={`
                                        transition-all
                                        duration-200
                                        text-slate-400

                                        ${
                                            active
                                                ? "opacity-100 translate-x-0 text-slate-900"
                                                : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                                        }
                                    `}
                                />

                            </Link>
                        );
                    })}

                </div>

            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-slate-100">

                <div className="flex items-center gap-2">

                    <div className="w-2 h-2 rounded-full bg-emerald-500" />

                    <span className="text-xs text-slate-500">
                        System Online
                    </span>

                </div>

            </div>

        </aside>
    );
}