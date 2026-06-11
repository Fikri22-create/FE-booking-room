import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Shield } from "lucide-react";
import { getUserById } from "../../services/userService";
import toast from "react-hot-toast";

export default function UserDetail() {
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            setLoading(true);

            const response = await getUserById(id);

            setUser(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch user");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-72">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20">
                User not found
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-3">
                <Link
                    to="/admin/users"
                    className="p-2 border rounded-lg"
                >
                    <ArrowLeft size={18} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold">
                        User Detail
                    </h1>

                    <p className="text-sm text-slate-500">
                        User information overview
                    </p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <div className="grid md:grid-cols-2 gap-6">

                    <Info
                        icon={<User size={16} />}
                        label="Name"
                        value={user.name}
                    />

                    <Info
                        icon={<Mail size={16} />}
                        label="Email"
                        value={user.email}
                    />

                    <Info
                        icon={<Shield size={16} />}
                        label="Role"
                        value={user.role}
                    />

                    <Info
                        label="Created At"
                        value={
                            user.createdAt
                                ? new Date(
                                    user.createdAt
                                ).toLocaleDateString("id-ID")
                                : "-"
                        }
                    />

                </div>

            </div>
        </div>
    );
}

function Info({
    label,
    value,
    icon
}) {
    return (
        <div>
            <p className="text-xs uppercase text-slate-400 mb-2 flex items-center gap-2">
                {icon}
                {label}
            </p>

            <p className="font-medium text-slate-900">
                {value || "-"}
            </p>
        </div>
    );
}