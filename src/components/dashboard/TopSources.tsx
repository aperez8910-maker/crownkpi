import { ExternalLink } from "lucide-react";

const sources = [
  { name: "Google Search", visits: 34200, percentage: 42, color: "from-blue-500 to-blue-400" },
  { name: "Direct", visits: 18900, percentage: 23, color: "from-primary to-primary" },
  { name: "Facebook", visits: 12400, percentage: 15, color: "from-indigo-500 to-blue-500" },
  { name: "Twitter/X", visits: 8200, percentage: 10, color: "from-sky-500 to-sky-400" },
  { name: "LinkedIn", visits: 4900, percentage: 6, color: "from-blue-600 to-blue-500" },
  { name: "Others", visits: 3400, percentage: 4, color: "from-muted to-muted" },
];

export function TopSources() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Traffic Sources</h3>
          <p className="text-sm text-muted-foreground">Where visitors come from</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-primary hover:underline">
          View all
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {sources.map((source, index) => (
          <div key={source.name} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{source.name}</span>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{source.visits.toLocaleString()}</span>
                <span className="font-medium w-12 text-right">{source.percentage}%</span>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${source.color} transition-all duration-700 ease-out`}
                style={{ 
                  width: `${source.percentage}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
