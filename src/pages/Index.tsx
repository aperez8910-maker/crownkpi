import { useState } from "react";
import { Users, Eye, MousePointerClick, Clock } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { GeolocationMap } from "@/components/dashboard/GeolocationMap";
import { SecurityScore } from "@/components/dashboard/SecurityScore";
import { URLAnalyzer } from "@/components/dashboard/URLAnalyzer";
import { MarketingInsights } from "@/components/dashboard/MarketingInsights";
import { TopSources } from "@/components/dashboard/TopSources";
import { RecentScans } from "@/components/dashboard/RecentScans";
import { CompetitorComparison } from "@/components/competitor/CompetitorComparison";
import { MonitoringDashboard } from "@/components/monitoring/MonitoringDashboard";
import { AnalysisResults } from "@/components/dashboard/AnalysisResults";
import { SavedReports } from "@/components/dashboard/SavedReports";
import { WebsiteAnalysis } from "@/lib/api/website-analysis";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysis | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "competitors":
        return <CompetitorComparison />;
      case "monitoring":
        return <MonitoringDashboard />;
        return (
          <div className="space-y-6">
            <URLAnalyzer />
            <RecentScans />
          </div>
        );
      case "traffic":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrafficChart />
              <TopSources />
            </div>
            <div className="data-grid">
              <MetricCard title="Total Visitors" value="118.2K" change={12.5} trend="up" icon={Users} accentColor="primary" />
              <MetricCard title="Page Views" value="342.8K" change={8.2} trend="up" icon={Eye} accentColor="accent" />
              <MetricCard title="Click Rate" value="4.28%" change={-2.1} trend="down" icon={MousePointerClick} accentColor="warning" />
              <MetricCard title="Avg. Session" value="3m 42s" change={5.8} trend="up" icon={Clock} accentColor="success" />
            </div>
          </div>
        );
      case "geolocation":
        return <GeolocationMap />;
      case "security":
        return <SecurityScore />;
      case "insights":
        return <MarketingInsights />;
      default:
        return (
          <>
            {/* URL Analyzer */}
            <URLAnalyzer onAnalyze={(url, analysis) => setAnalysisResult(analysis)} />

            {/* Analysis Results */}
            {analysisResult && <AnalysisResults analysis={analysisResult} />}

            {/* Key Metrics */}
            <div className="data-grid">
              <MetricCard title="Total Visitors" value="118.2K" change={12.5} trend="up" icon={Users} accentColor="primary" />
              <MetricCard title="Page Views" value="342.8K" change={8.2} trend="up" icon={Eye} accentColor="accent" />
              <MetricCard title="Click Rate" value="4.28%" change={-2.1} trend="down" icon={MousePointerClick} accentColor="warning" />
              <MetricCard title="Avg. Session" value="3m 42s" change={5.8} trend="up" icon={Clock} accentColor="success" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrafficChart />
              <TopSources />
            </div>

            {/* Insights & Geo Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketingInsights />
              <GeolocationMap />
            </div>

            {/* Security & Saved Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SecurityScore />
              <SavedReports />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="ml-64 min-h-screen">
        <Header />
        
        <div className="p-6 space-y-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
