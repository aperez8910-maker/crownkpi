import { useState, useEffect } from "react";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Play,
  Calendar,
  Mail,
  Globe,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  getCronJobRuns, 
  getAlertHistory, 
  getActiveSubscriptions,
  triggerManualCheck,
  CronJobRun,
  AlertHistoryItem,
  SubscriptionWithLastCheck
} from "@/lib/api/monitoring";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export function MonitoringDashboard() {
  const [jobRuns, setJobRuns] = useState<CronJobRun[]>([]);
  const [alerts, setAlerts] = useState<AlertHistoryItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithLastCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    const [runs, alertHistory, subs] = await Promise.all([
      getCronJobRuns(10),
      getAlertHistory(20),
      getActiveSubscriptions()
    ]);
    setJobRuns(runs);
    setAlerts(alertHistory);
    setSubscriptions(subs);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTriggerCheck = async () => {
    setIsTriggering(true);
    toast({
      title: "Starting check...",
      description: "Analyzing all subscribed competitors"
    });

    const result = await triggerManualCheck();
    
    if (result.success) {
      toast({
        title: "Check complete!",
        description: `Checked ${result.checked || 0} subscriptions, sent ${result.alerts || 0} alerts`
      });
      fetchData();
    } else {
      toast({
        title: "Check failed",
        description: result.error || "Unknown error",
        variant: "destructive"
      });
    }
    
    setIsTriggering(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success/20 text-success border-success/30">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'running':
        return <Badge variant="secondary">Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Monitoring Dashboard</h2>
              <p className="text-sm text-muted-foreground">Track job runs, alerts, and subscription status</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="glow" onClick={handleTriggerCheck} disabled={isTriggering}>
              {isTriggering ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Run Check Now
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="text-sm text-muted-foreground">Active Subscriptions</div>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="text-sm text-muted-foreground">Total Alerts Sent</div>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="text-sm text-muted-foreground">Job Runs</div>
            <div className="text-2xl font-bold">{jobRuns.length}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="text-sm text-muted-foreground">Last Check</div>
            <div className="text-lg font-semibold">
              {jobRuns[0] ? formatDistanceToNow(new Date(jobRuns[0].started_at), { addSuffix: true }) : 'Never'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cron Job Runs */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Job Runs
            </CardTitle>
            <CardDescription>Daily competitor check execution history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobRuns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No job runs yet</p>
                  <p className="text-sm">Click "Run Check Now" to start</p>
                </div>
              ) : (
                jobRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(run.status)}
                      <div>
                        <div className="font-medium text-sm">
                          {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {run.subscriptions_checked} checked • {run.alerts_sent} alerts
                          {run.duration_seconds && ` • ${run.duration_seconds.toFixed(1)}s`}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(run.status)}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alert History */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Alert History
            </CardTitle>
            <CardDescription>Emails sent when competitor scores changed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No alerts sent yet</p>
                  <p className="text-sm">Alerts trigger when scores change by 5+ points</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="p-3 rounded-lg bg-secondary/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {new URL(alert.competitor_url).hostname}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                      {alert.score_change > 0 ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                        <span className={`font-bold text-sm ${alert.score_change > 0 ? 'text-success' : 'text-destructive'}`}>
                          {alert.score_change > 0 ? '+' : ''}{alert.score_change}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {alert.email}
                      </div>
                      <span>{formatDistanceToNow(new Date(alert.sent_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Subscriptions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Active Subscriptions
          </CardTitle>
          <CardDescription>Competitors being monitored for changes</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active subscriptions</p>
              <p className="text-sm">Add competitors and subscribe to alerts</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="p-4 rounded-lg bg-secondary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="font-medium truncate">
                      {new URL(sub.competitor_url).hostname}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {sub.email}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SEO Score: {sub.last_seo_score ?? 'N/A'}</span>
                      {sub.last_checked_at && (
                        <span>Checked {formatDistanceToNow(new Date(sub.last_checked_at), { addSuffix: true })}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
