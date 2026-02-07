import { Clock, Globe, ArrowUpRight, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface Scan {
  id: string;
  url: string;
  status: "completed" | "running" | "warning";
  timestamp: string;
  score: number;
}

const recentScans: Scan[] = [
  { id: "1", url: "techcrunch.com", status: "completed", timestamp: "2 min ago", score: 92 },
  { id: "2", url: "producthunt.com", status: "completed", timestamp: "15 min ago", score: 87 },
  { id: "3", url: "stripe.com", status: "running", timestamp: "Just now", score: 0 },
  { id: "4", url: "notion.so", status: "warning", timestamp: "1 hour ago", score: 64 },
  { id: "5", url: "figma.com", status: "completed", timestamp: "2 hours ago", score: 95 },
];

export function RecentScans() {
  const getStatusIcon = (status: Scan["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "running": return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-warning" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    if (score > 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Recent Scans</h3>
            <p className="text-sm text-muted-foreground">Latest website analyses</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {recentScans.map((scan) => (
          <div 
            key={scan.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(scan.status)}
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{scan.url}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">{scan.timestamp}</span>
              {scan.score > 0 && (
                <span className={`font-semibold ${getScoreColor(scan.score)}`}>
                  {scan.score}
                </span>
              )}
              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
