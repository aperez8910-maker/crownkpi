import { useState } from "react";
import { Plus, Scale, Loader2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompetitorCard } from "./CompetitorCard";
import { fullWebsiteAnalysis, WebsiteAnalysis } from "@/lib/api/website-analysis";
import { useToast } from "@/hooks/use-toast";

interface CompetitorSlot {
  id: string;
  url: string;
  analysis: WebsiteAnalysis | null;
  isLoading: boolean;
}

export function CompetitorComparison() {
  const [competitors, setCompetitors] = useState<CompetitorSlot[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const addCompetitor = async () => {
    if (!newUrl.trim()) return;
    if (competitors.length >= 4) {
      toast({
        title: "Maximum reached",
        description: "You can compare up to 4 websites at once.",
        variant: "destructive"
      });
      return;
    }

    const id = crypto.randomUUID();
    const url = newUrl.trim();
    
    setCompetitors(prev => [...prev, { id, url, analysis: null, isLoading: true }]);
    setNewUrl("");
    setIsAdding(false);

    try {
      const result = await fullWebsiteAnalysis(url);
      
      if (result.success && result.analysis) {
        setCompetitors(prev => 
          prev.map(c => c.id === id ? { ...c, analysis: result.analysis!, isLoading: false } : c)
        );
        toast({
          title: "Analysis complete",
          description: `Successfully analyzed ${new URL(url).hostname}`,
        });
      } else {
        setCompetitors(prev => prev.filter(c => c.id !== id));
        toast({
          title: "Analysis failed",
          description: result.error || "Failed to analyze website",
          variant: "destructive"
        });
      }
    } catch (error) {
      setCompetitors(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Error",
        description: "Failed to analyze website. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeCompetitor = (id: string) => {
    setCompetitors(prev => prev.filter(c => c.id !== id));
  };

  const getBenchmarkWinner = (metric: 'seoScore') => {
    const analyzed = competitors.filter(c => c.analysis);
    if (analyzed.length < 2) return null;
    
    return analyzed.reduce((best, current) => {
      if (!current.analysis || !best.analysis) return best;
      return current.analysis[metric] > best.analysis[metric] ? current : best;
    });
  };

  const winner = getBenchmarkWinner('seoScore');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Competitor Benchmarking</h2>
              <p className="text-sm text-muted-foreground">Compare up to 4 websites side-by-side</p>
            </div>
          </div>
          
          {!isAdding && competitors.length < 4 && (
            <Button onClick={() => setIsAdding(true)} variant="glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Competitor
            </Button>
          )}
        </div>

        {/* Add URL Input */}
        {isAdding && (
          <div className="flex gap-3 mt-4">
            <Input
              type="url"
              placeholder="https://competitor.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
              className="flex-1"
              autoFocus
            />
            <Button onClick={addCompetitor} disabled={!newUrl.trim()}>
              Analyze
            </Button>
            <Button variant="ghost" onClick={() => { setIsAdding(false); setNewUrl(""); }}>
              Cancel
            </Button>
          </div>
        )}

        {/* Benchmark Winner */}
        {winner?.analysis && competitors.filter(c => c.analysis).length >= 2 && (
          <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-gold-dark/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-primary" />
              <div>
                <span className="text-sm text-muted-foreground">Leading Competitor: </span>
                <span className="font-semibold">{new URL(winner.url).hostname}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  (SEO Score: {winner.analysis.seoScore})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Competitor Grid */}
      {competitors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {competitors.map((competitor) => (
            <CompetitorCard
              key={competitor.id}
              analysis={competitor.analysis}
              isLoading={competitor.isLoading}
              onRemove={() => removeCompetitor(competitor.id)}
            />
          ))}
          
          {/* Empty slots */}
          {competitors.length < 4 && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="glass-card p-6 min-h-[400px] flex items-center justify-center border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <div className="text-center text-muted-foreground group-hover:text-primary transition-colors">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Add Competitor</p>
              </div>
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Scale className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No competitors added yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Add competitor websites to see how they compare in terms of SEO, traffic, keywords, and marketing strategies.
          </p>
          <Button onClick={() => setIsAdding(true)} variant="glow" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Competitor
          </Button>
        </div>
      )}
    </div>
  );
}
