import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User, LogOut } from "lucide-react";

export default function Navbar({ role }) {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 md:px-8 flex justify-between items-center sticky top-0 z-40">
            <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5 leading-none">
                    Welcome back, {user?.name?.split(" ")[0] || "User"} <span className="animate-pulse"></span>
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">
                    {role === "admin"
                        ? "Here's your dashboard overview today."
                        : "Book and manage your perfect room seamlessly."}
                </p>
            </div>
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-3 pl-3 py-1">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                        <p className="text-[11px] font-medium text-slate-400 capitalize mt-0.5">{role}</p>
                    </div>
                
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-sm">
                        <User size={16} className="stroke-[2.2]" />
                    </div>
                </div>
                <div className="w-[1px] h-6 bg-slate-200 hidden sm:block" />
                <button
                    onClick={logout}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semiboldtransition-all active:scale-95 duration-200${
                        role === "admin"
                            ? "text-slate-500 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100"
                            : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100"
                        }
                    `}
                >
                    <LogOut size={14} className="stroke-[2.2]" />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}