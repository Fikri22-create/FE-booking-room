import { useEffect, useMemo, useState } from "react";
import { getUsers } from "../../services/userService";
import {
    Search,
    Users as UsersIcon,
    Mail,
    Shield,
    Calendar
} from "lucide-react";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            setUsers(response.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const keyword = search.toLowerCase();

            return (
                u.name?.toLowerCase().includes(keyword) ||
                u.email?.toLowerCase().includes(keyword) ||
                u.role?.toLowerCase().includes(keyword)
            );
        });
    }, [users, search]);

    const total = users.length;
    const admin = users.filter((u) => u.role === "admin").length;
    const userCount = users.filter((u) => u.role === "user").length;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-72 text-slate-500">
                Loading users...
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Users</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage registered users in the system.
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                <StatCard
                    title="Total Users"
                    value={total}
                    icon={<UsersIcon size={20} />}
                    color="blue"
                />

                <StatCard
                    title="Admin"
                    value={admin}
                    icon={<Shield size={20} />}
                    color="emerald"
                />

                <StatCard
                    title="User"
                    value={userCount}
                    icon={<Mail size={20} />}
                    color="amber"
                />
            </div>

            {/* SEARCH */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users by name, email, role..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent focus:outline-none focus:bg-slate-50 text-sm"
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">ID</th>
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left">Email</th>
                                <th className="px-6 py-4 text-left">Role</th>
                                <th className="px-6 py-4 text-left">Created</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">

                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            #{user.id}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {user.name}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {user.email}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${user.role === "admin"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-100 text-slate-700"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString("id-ID")
                                                    : "-"}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value, icon, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex justify-between items-center shadow-sm hover:shadow-md transition">
            <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                    {title}
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    {value}
                </h2>
            </div>

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[color]}`}>
                {icon}
            </div>
        </div>
    );
}