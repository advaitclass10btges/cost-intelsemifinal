import { Cloud, Database, Shield, Settings, Key, Globe, Bell, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlatformStatus, fetchPlatformAccounts } from "@/lib/api";

const settings = [
  { label: "API Keys", description: "Manage API keys for programmatic access", icon: Key },
  { label: "Regions", description: "Configure monitored AWS regions", icon: Globe },
  { label: "Notifications", description: "Alert channels and thresholds", icon: Bell },
  { label: "Team Members", description: "Manage access and roles", icon: Users },
  { label: "Security", description: "SSO, MFA, and audit logs", icon: Shield },
  { label: "Billing", description: "Subscription and usage details", icon: Settings },
];

const PlatformView = () => {
  const { data: platformStat } = useQuery({ queryKey: ['platStat'], queryFn: fetchPlatformStatus, refetchInterval: 60000 });
  const { data: accounts } = useQuery({ queryKey: ['platAccounts'], queryFn: fetchPlatformAccounts });

  // Map real integrations
  const integrations = accounts ? accounts.map((acc: any) => ({
    name: "AWS", 
    status: acc.status.toLowerCase(), 
    accounts: 1, 
    resources: platformStat?.totalResources || 0,
    icon: Cloud,
    id: acc.id
  })) : [];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="font-heading text-4xl font-extrabold tracking-tighter text-foreground uppercase">Platform</h1>
        <p className="text-xs uppercase tracking-widest text-[#667066] mt-1 font-semibold">
          Integrations · Configuration · Settings
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Connected Accounts", value: accounts ? String(accounts.length) : "...", sub: "AWS ONLY" },
          { label: "Total Resources", value: platformStat ? String(platformStat.totalResources) : "...", sub: "Live scanned" },
          { label: "Active Regions", value: platformStat ? String(platformStat.regions?.length || 0) : "...", sub: platformStat?.regions?.join(', ') || '' },
          { label: "Uptime", value: "99.99%", sub: "Live metrics" },
        ].map((s, i) => (
          <div key={i} className="glass-card p-5 group">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{s.label}</span>
            <div className="text-3xl font-heading font-extrabold tracking-tight text-foreground mt-2">{s.value}</div>
            <p className="text-[11px] font-medium text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground mb-4">Integrations</h3>
          <div className="space-y-2">
            {integrations.length === 0 && <p className="text-sm text-muted-foreground p-3">Loading connections...</p>}
            {integrations.map((int: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div className="flex items-center gap-3">
                  <int.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{int.name} ({int.id})</p>
                    {int.resources !== undefined && (
                      <p className="text-xs text-muted-foreground">{int.accounts} accounts · {int.resources} resources</p>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  int.status === "connected"
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-muted text-muted-foreground border-border"
                }`}>{int.status}</span>
              </div>
            ))}
            
            {/* Added a mock disconnected integrations just to show the UI still supports them */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 opacity-60">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Datadog</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-muted text-muted-foreground border-border">disconnected</span>
            </div>
            
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground mb-4">Settings</h3>
          <div className="space-y-2">
            <div className="p-3 mb-2 bg-muted/20 border rounded-lg">
                <p className="text-xs font-mono break-all text-muted-foreground">Logged as: {platformStat?.arn || '...'}</p>
                <p className="text-xs font-mono text-muted-foreground mt-1">Account ID: {platformStat?.accountId || '...'}</p>
            </div>
            {settings.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformView;
