import { useEffect, useState } from "react";
import { getRecentReports, SavedReport } from "@/lib/api/analysis-reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Globe, TrendingUp, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SavedReports() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    setIsLoading(true);
    const result = await getRecentReports(10);
    if (result.success && result.reports) {
      setReports(result.reports);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Saved Reports
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchReports} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <FileText className="w-10 h-10 mb-2 opacity-50" />
            <p>No saved reports yet</p>
            <p className="text-sm">Analyze a website and save the report</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="font-medium">{report.hostname}</span>
                    </div>
                    <div className={`font-bold ${getScoreColor(report.seo_score)}`}>
                      {report.seo_score}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(report.created_at).toLocaleDateString()}
                    {report.traffic_estimate && (
                      <>
                        <span className="mx-1">•</span>
                        <TrendingUp className="w-3 h-3" />
                        {report.traffic_estimate}
                      </>
                    )}
                  </div>
                  {report.top_keywords && report.top_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {report.top_keywords.slice(0, 3).map((keyword, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
