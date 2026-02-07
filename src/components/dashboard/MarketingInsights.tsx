import { Lightbulb, TrendingUp, Target, Megaphone, DollarSign, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  icon: React.ElementType;
}

const insights: Insight[] = [
  {
    id: "1",
    title: "Optimize Landing Page CTA",
    description: "Your main CTA button has low visibility. Moving it above the fold could increase conversions by 23%.",
    impact: "high",
    category: "Conversion",
    icon: Target,
  },
  {
    id: "2", 
    title: "Add Social Proof Section",
    description: "Pages with testimonials show 34% higher engagement. Consider adding customer reviews.",
    impact: "high",
    category: "Trust",
    icon: Megaphone,
  },
  {
    id: "3",
    title: "Improve Mobile Experience",
    description: "42% of traffic is mobile, but bounce rate is 15% higher. Optimize touch targets and load time.",
    impact: "medium",
    category: "UX",
    icon: TrendingUp,
  },
  {
    id: "4",
    title: "Implement Exit-Intent Popup",
    description: "Capture leaving visitors with a targeted offer. Expected lift: 5-10% lead recovery.",
    impact: "medium",
    category: "Lead Gen",
    icon: DollarSign,
  },
];

export function MarketingInsights() {
  const getImpactColor = (impact: Insight["impact"]) => {
    switch (impact) {
      case "high": return "text-success bg-success/10 border-success/30";
      case "medium": return "text-warning bg-warning/10 border-warning/30";
      case "low": return "text-muted-foreground bg-muted/10 border-muted/30";
    }
  };

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Marketing Insights</h3>
            <p className="text-sm text-muted-foreground">Actionable recommendations</p>
          </div>
        </div>
        <span className="text-sm text-primary font-medium">{insights.length} suggestions</span>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <insight.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{insight.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{insight.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{insight.category}</span>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Apply
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
