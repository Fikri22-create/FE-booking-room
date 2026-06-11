import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function BaseLayout({ children }) {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar role={user?.role} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar role={user?.role} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}