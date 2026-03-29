import { useAlerts } from "@/hooks/useAlerts";
import { 
  Bell, 
  X, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Trash2 
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const severityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  high: "bg-rose-500/10 text-rose-500 border-rose-500/20"
};

const typeIcons = {
  cost: TrendingUp,
  idle: Zap,
  anomaly: AlertTriangle,
  savings: CheckCircle2
};

export const AlertPanel = () => {
    const { alerts, unreadCount, markAllAsRead } = useAlerts();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center h-9 w-9 rounded-full bg-black/5 text-muted-foreground hover:bg-black/10 hover:text-foreground transition-all"
            >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg overflow-hidden border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end bg-black/20 backdrop-blur-sm transition-all duration-300 animate-in fade-in" 
                     onClick={() => setIsOpen(false)}>
                    <div 
                        className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-heading font-extrabold uppercase tracking-tight">System Alerts</h3>
                                <span className="px-2 py-0.5 rounded-full bg-black/5 text-[10px] font-bold text-muted-foreground">
                                    {alerts.length} FINDINGS
                                </span>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-black/5 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {alerts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-40">
                                    <Bell className="h-12 w-12 mb-4" />
                                    <p className="font-heading font-bold text-sm">ALL CLEAR</p>
                                    <p className="text-xs">No active alerts detected</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-black/5">
                                    {alerts.map((alert) => {
                                        const Icon = typeIcons[alert.type];
                                        return (
                                            <div key={alert.id} className={`p-6 hover:bg-black/[0.02] transition-colors relative group ${!alert.read ? 'bg-blue-50/30' : ''}`}>
                                                <div className="flex gap-4">
                                                    <div className={`mt-1 flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg ${severityColors[alert.severity]}`}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <h4 className="text-sm font-bold text-foreground leading-tight">{alert.title}</h4>
                                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                                {format(new Date(alert.timestamp), 'h:mm a')}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                                                            {alert.description}
                                                        </p>
                                                        {alert.estimatedSavings && (
                                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                                                                POTENTIAL SAVINGS: ${alert.estimatedSavings.toFixed(2)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {alerts.length > 0 && (
                            <div className="p-6 border-t bg-black/[0.01]">
                                <button 
                                    onClick={markAllAsRead}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#9bb096] text-white font-heading font-extrabold text-[11px] uppercase tracking-wider shadow-lg shadow-[#9bb096]/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Dismiss All Notifications
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
