import { Toaster, toast as hotToast } from "react-hot-toast";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    X,
} from "lucide-react";

export function AppToaster() {
    return (
        <Toaster position="top-right" gutter={10} containerStyle={{ top: 20, right: 20 }} toastOptions={{ duration: 3500 }}/>
    );
}
const icons = {
    success: <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />,
    error: <XCircle size={18} className="shrink-0 text-rose-500" />,
    warning: <AlertTriangle size={18} className="shrink-0 text-amber-500" />,
    info: <Info size={18} className="shrink-0 text-blue-500" />,
};
const bars = { success: "bg-emerald-500", error: "bg-rose-500", warning: "bg-amber-400", info: "bg-blue-500"};
const borders = { success: "border-emerald-100", error: "border-rose-100", warning: "border-amber-100", info:    "border-blue-100"};
function renderToast(type, message) {
    hotToast.custom(
        (t) => (
            <div className={`flex items-start gap-3 w-80 bg-white rounded-2xl border ${borders[type]} shadow-[0_8px_30px_rgba(0,0,0,0.10)] px-4 py-3.5 relative overflow-hidden transition-all duration-300 ${t.visible ? "toast-enter" : "opacity-0"}`}>
                <span className={`absolute top-0 left-0 h-0.5 ${bars[type]} animate-shrink`} style={{ animationDuration: "3.5s" }}/>
                <span className="mt-0.5">{icons[type]}</span>
                <p className="flex-1 text-sm font-medium text-slate-800 leading-snug">{message}</p>
                <button onClick={() => hotToast.dismiss(t.id)} className="shrink-0 mt-0.5 text-slate-300 hover:text-slate-500 transition-colors" ><X size={14} /></button>
            </div>
        ),
        { duration: 3500 }
    );
}
export const toast = {
    success: (msg) => renderToast("success", msg),
    error:   (msg) => renderToast("error",   msg),
    warning: (msg) => renderToast("warning", msg),
    info:    (msg) => renderToast("info",    msg),
};