import { MapPin } from "lucide-react";

const locationData = [
  { country: "United States", visitors: 45200, percentage: 38.2, flag: "🇺🇸" },
  { country: "United Kingdom", visitors: 18900, percentage: 16.0, flag: "🇬🇧" },
  { country: "Germany", visitors: 12400, percentage: 10.5, flag: "🇩🇪" },
  { country: "France", visitors: 9800, percentage: 8.3, flag: "🇫🇷" },
  { country: "Canada", visitors: 8200, percentage: 6.9, flag: "🇨🇦" },
  { country: "Australia", visitors: 6100, percentage: 5.2, flag: "🇦🇺" },
  { country: "Japan", visitors: 5400, percentage: 4.6, flag: "🇯🇵" },
  { country: "Others", visitors: 12200, percentage: 10.3, flag: "🌍" },
];

export function GeolocationMap() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Visitor Geolocation</h3>
          <p className="text-sm text-muted-foreground">Traffic by country</p>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">118.2K total</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {locationData.map((location, index) => (
          <div key={location.country} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{location.flag}</span>
                <span className="text-sm font-medium">{location.country}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{location.visitors.toLocaleString()}</span>
                <span className="font-medium text-primary">{location.percentage}%</span>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/30"
                style={{ 
                  width: `${location.percentage}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
