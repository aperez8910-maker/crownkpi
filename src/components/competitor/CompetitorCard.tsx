import { Globe, TrendingUp, TrendingDown, Target, Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysis } from "@/lib/api/website-analysis";
import { AlertSubscription } from "./AlertSubscription";

interface CompetitorCardProps {
  analysis: WebsiteAnalysis | null;
  isLoading?: boolean;
  onRemove: () => void;
}

export function CompetitorCard({ analysis, isLoading, onRemove }: CompetitorCardProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Analyzing website...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="glass-card p-6 min-h-[400px] flex items-center justify-center border-2 border-dashed border-border">
        <div className="text-center text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Add a competitor URL to compare</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const channels = analysis.marketingChannels;
  const channelData = [
    { name: "Organic", value: channels.organic, color: "bg-primary" },
    { name: "Paid", value: channels.paid, color: "bg-accent" },
    { name: "Social", value: channels.social, color: "bg-success" },
    { name: "Direct", value: channels.direct, color: "bg-warning" },
    { name: "Referral", value: channels.referral, color: "bg-chart-4" },
  ];

  return (
    <div className="glass-card p-6 relative group">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <AlertSubscription competitorUrl={analysis.url} currentScore={analysis.seoScore} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{new URL(analysis.url).hostname}</h3>
          <p className="text-xs text-muted-foreground truncate">{analysis.url}</p>
        </div>
      </div>

      {/* SEO Score */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-secondary/30">
        <div>
          <div className="text-sm text-muted-foreground mb-1">SEO Score</div>
          <div className={`text-3xl font-bold ${getScoreColor(analysis.seoScore)}`}>
            {analysis.seoScore}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">Est. Traffic</div>
          <div className="text-lg font-semibold">{analysis.trafficEstimate}</div>
        </div>
      </div>

      {/* Top Keywords */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Top Keywords
        </h4>
        <div className="flex flex-wrap gap-2">
          {analysis.topKeywords.slice(0, 5).map((keyword, i) => (
            <span key={i} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Channel Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Traffic Sources</h4>
        <div className="space-y-2">
          {channelData.map((channel) => (
            <div key={channel.name} className="flex items-center gap-2">
              <span className="text-xs w-16 text-muted-foreground">{channel.name}</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${channel.color} rounded-full transition-all`}
                  style={{ width: `${channel.value}%` }}
                />
              </div>
              <span className="text-xs w-8 text-right">{channel.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-success">
          <TrendingUp className="w-4 h-4" />
          Strengths
        </h4>
        <ul className="space-y-1">
          {analysis.strengths.slice(0, 3).map((strength, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
              <span className="text-success mt-0.5">•</span>
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-warning">
          <TrendingDown className="w-4 h-4" />
          Weaknesses
        </h4>
        <ul className="space-y-1">
          {analysis.weaknesses.slice(0, 3).map((weakness, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
              <span className="text-warning mt-0.5">•</span>
              {weakness}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
