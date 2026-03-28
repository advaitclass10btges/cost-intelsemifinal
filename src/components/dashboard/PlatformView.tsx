import { Cloud, Database, Shield, Settings, Key, Globe, Bell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const integrations = [
  { name: "AWS", status: "connected", accounts: 3, resources: 612, icon: Cloud },
  { name: "GCP", status: "connected", accounts: 2, resources: 235, icon: Cloud },
  { name: "Datadog", status: "connected", accounts: 1, resources: null, icon: Database },
  { name: "Slack", status: "connected", accounts: 1, resources: null, icon: Bell },
  { name: "PagerDuty", status: "disconnected", accounts: 0, resources: null, icon: Shield },
  { name: "Jira", status: "disconnected", accounts: 0, resources: null, icon: Settings },
];

const settings = [
  { label: "API Keys", description: "Manage API keys for programmatic access", icon: Key },
  { label: "Regions", description: "Configure monitored AWS/GCP regions", icon: Globe },
  { label: "Notifications", description: "Alert channels and thresholds", icon: Bell },
  { label: "Team Members", description: "Manage access and roles", icon: Users },
  { label: "Security", description: "SSO, MFA, and audit logs", icon: Shield },
  { label: "Billing", description: "Subscription and usage details", icon: Settings },
];

const PlatformView = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform</h1>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
          Integrations · Configuration · Settings
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Connected Accounts", value: "5", sub: "3 AWS · 2 GCP" },
          { label: "Total Resources", value: "847", sub: "Across all providers" },
          { label: "Team Members", value: "8", sub: "3 admins · 5 viewers" },
          { label: "Uptime", value: "99.97%", sub: "Last 90 days" },
        ].map((s, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</span>
            <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{s.value}</div>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Integrations</h3>
          <div className="space-y-2">
            {integrations.map((int, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div className="flex items-center gap-3">
                  <int.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{int.name}</p>
                    {int.resources && (
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
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Settings</h3>
          <div className="space-y-2">
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
