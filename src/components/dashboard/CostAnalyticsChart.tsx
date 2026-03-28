import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { day: "Mon", actual: 2800, forecast: 3000 },
  { day: "Tue", actual: 3200, forecast: 3100 },
  { day: "Wed", actual: 2900, forecast: 3200 },
  { day: "Thu", actual: 4100, forecast: 3400 },
  { day: "Fri", actual: 5200, forecast: 3500 },
  { day: "Sat", actual: 4800, forecast: 3600 },
  { day: "Sun", actual: 4200, forecast: 3700 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 shadow-xl border-white/40">
      <p className="text-[11px] font-bold text-foreground mb-1 uppercase tracking-tight">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-[11px] font-medium text-muted-foreground">
          {entry.name}: <span className="font-mono text-foreground">${entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

const CostAnalyticsChart = () => {
  return (
    <div className="glass-card p-5">
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Cost Analytics</h3>
        <p className="text-xs text-muted-foreground mt-0.5">7-day cloud spend vs forecast</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(150, 40%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(150, 40%, 45%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(150, 30%, 75%)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(150, 30%, 75%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 10%, 88%)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "hsl(150, 5%, 45%)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(150, 5%, 45%)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="hsl(150, 30%, 75%)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#forecastGrad)"
            name="Forecast"
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="hsl(150, 40%, 45%)"
            strokeWidth={2}
            fill="url(#actualGrad)"
            name="Actual"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostAnalyticsChart;
