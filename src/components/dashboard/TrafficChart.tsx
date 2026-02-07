import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", visitors: 4000, pageViews: 6400 },
  { name: "Tue", visitors: 3000, pageViews: 4398 },
  { name: "Wed", visitors: 5000, pageViews: 9800 },
  { name: "Thu", visitors: 2780, pageViews: 3908 },
  { name: "Fri", visitors: 4890, pageViews: 8800 },
  { name: "Sat", visitors: 2390, pageViews: 3800 },
  { name: "Sun", visitors: 3490, pageViews: 5300 },
];

export function TrafficChart() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Traffic Overview</h3>
          <p className="text-sm text-muted-foreground">Weekly visitor analytics</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Visitors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Page Views</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(43 96% 56%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(43 96% 56%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(280 85% 65%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(280 85% 65%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
          <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
          <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(222 47% 10%)", 
              border: "1px solid hsl(222 30% 18%)",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}
            labelStyle={{ color: "hsl(210 40% 98%)" }}
          />
          <Area 
            type="monotone" 
            dataKey="visitors" 
            stroke="hsl(43 96% 56%)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorVisitors)" 
          />
          <Area 
            type="monotone" 
            dataKey="pageViews" 
            stroke="hsl(280 85% 65%)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPageViews)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
