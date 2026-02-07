import { Shield, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface SecurityItem {
  name: string;
  status: "pass" | "warning" | "fail";
  description: string;
}

const securityItems: SecurityItem[] = [
  { name: "SSL Certificate", status: "pass", description: "Valid and up to date" },
  { name: "HTTPS Redirect", status: "pass", description: "Properly configured" },
  { name: "Content Security Policy", status: "warning", description: "Partial implementation" },
  { name: "XSS Protection", status: "pass", description: "Headers configured" },
  { name: "HSTS Header", status: "fail", description: "Not implemented" },
  { name: "Clickjacking Protection", status: "pass", description: "X-Frame-Options set" },
];

export function SecurityScore() {
  const passCount = securityItems.filter(i => i.status === "pass").length;
  const score = Math.round((passCount / securityItems.length) * 100);

  const getStatusIcon = (status: SecurityItem["status"]) => {
    switch (status) {
      case "pass": return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "fail": return <XCircle className="w-5 h-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: SecurityItem["status"]) => {
    switch (status) {
      case "pass": return <span className="badge-success">Passed</span>;
      case "warning": return <span className="badge-warning">Warning</span>;
      case "fail": return <span className="badge-danger">Failed</span>;
    }
  };

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Security Audit</h3>
          <p className="text-sm text-muted-foreground">Website security analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                strokeWidth="4"
                stroke="hsl(var(--secondary))"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                strokeWidth="4"
                stroke={score >= 80 ? "hsl(var(--success))" : score >= 50 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                fill="none"
                strokeDasharray={`${score * 1.76} 176`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{score}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {securityItems.map((item) => (
          <div 
            key={item.name} 
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(item.status)}
              <div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </div>
            {getStatusBadge(item.status)}
          </div>
        ))}
      </div>
    </div>
  );
}
