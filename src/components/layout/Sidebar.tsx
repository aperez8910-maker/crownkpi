import { 
  LayoutDashboard, 
  Globe, 
  BarChart3, 
  Shield, 
  MapPin, 
  Lightbulb,
  Settings,
  Crown,
  Scale,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "competitors", label: "Competitor Analysis", icon: Scale },
  { id: "monitoring", label: "Monitoring", icon: Clock },
  { id: "analyze", label: "Analyze URL", icon: Globe },
  { id: "traffic", label: "Traffic Analytics", icon: BarChart3 },
  { id: "geolocation", label: "Geolocation", icon: MapPin },
  { id: "security", label: "Security Scan", icon: Shield },
  { id: "insights", label: "AI Insights", icon: Lightbulb },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/30">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">CrownKPI</h1>
            <p className="text-xs text-muted-foreground">Rule your metrics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "nav-item w-full",
              activeTab === item.id && "active"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-sidebar-border">
        <button className="nav-item w-full">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
