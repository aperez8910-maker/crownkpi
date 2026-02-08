import { useState } from "react";
import { Globe, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fullWebsiteAnalysis, WebsiteAnalysis } from "@/lib/api/website-analysis";
import { useToast } from "@/hooks/use-toast";

interface URLAnalyzerProps {
  onAnalyze?: (url: string, analysis: WebsiteAnalysis) => void;
}

export function URLAnalyzer({ onAnalyze }: URLAnalyzerProps) {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    const trimmedUrl = url.trim();
    console.log('handleAnalyze called, url:', trimmedUrl);
    
    if (!trimmedUrl) {
      console.log('URL is empty, returning');
      return;
    }
    
    setIsAnalyzing(true);
    console.log('Starting analysis...');
    
    try {
      const result = await fullWebsiteAnalysis(trimmedUrl);
      console.log('Analysis result:', result);
      
      if (result.success && result.analysis) {
        toast({
          title: "Analysis complete",
          description: `Successfully analyzed ${new URL(trimmedUrl).hostname}`,
        });
        onAnalyze?.(trimmedUrl, result.analysis);
      } else {
        toast({
          title: "Analysis failed",
          description: result.error || "Failed to analyze website",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="glass-card p-8 glow-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-lg">
          <Globe className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Analyze Website</h2>
          <p className="text-sm text-muted-foreground">Enter a URL to start deep analysis</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 text-lg pl-12 pr-4"
          />
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
        <Button 
          type="button"
          onClick={handleAnalyze} 
          disabled={!url.trim() || isAnalyzing}
          size="xl"
          variant="glow"
          className="min-w-[160px]"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>AI-powered analysis includes traffic, security, SEO, and marketing insights</span>
      </div>
    </div>
  );
}
