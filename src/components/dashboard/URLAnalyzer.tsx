import { useState } from "react";
import { Globe, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface URLAnalyzerProps {
  onAnalyze?: (url: string) => void;
}

export function URLAnalyzer({ onAnalyze }: URLAnalyzerProps) {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return;
    
    setIsAnalyzing(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    onAnalyze?.(url);
  };

  return (
    <div className="glass-card p-8 glow-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
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
          onClick={handleAnalyze} 
          disabled={!url || isAnalyzing}
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
