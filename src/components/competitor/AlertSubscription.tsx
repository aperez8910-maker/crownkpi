import { useState } from "react";
import { Bell, BellOff, Mail, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { subscribeToCompetitor } from "@/lib/api/competitor-alerts";
import { useToast } from "@/hooks/use-toast";

interface AlertSubscriptionProps {
  competitorUrl: string;
  currentScore?: number;
}

export function AlertSubscription({ competitorUrl, currentScore }: AlertSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    
    setIsSubscribing(true);
    
    try {
      const result = await subscribeToCompetitor(email, competitorUrl, currentScore);
      
      if (result.success) {
        setIsSubscribed(true);
        toast({
          title: "Subscribed!",
          description: `You'll receive alerts when ${new URL(competitorUrl).hostname} changes.`,
        });
        setTimeout(() => setIsOpen(false), 1500);
      } else {
        toast({
          title: "Subscription failed",
          description: result.error || "Failed to subscribe",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Get alerts">
          <Bell className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Get Change Alerts
          </DialogTitle>
          <DialogDescription>
            Receive email notifications when {new URL(competitorUrl).hostname}'s SEO score or marketing strategy changes significantly.
          </DialogDescription>
        </DialogHeader>
        
        {isSubscribed ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium">You're subscribed!</p>
            <p className="text-sm text-muted-foreground mt-1">
              We'll email you when changes are detected.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your email address</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  />
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">What we'll alert you about:</p>
              <ul className="space-y-1">
                <li>• SEO score changes of 5+ points</li>
                <li>• Major keyword ranking shifts</li>
                <li>• Marketing channel changes</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleSubscribe} 
              disabled={!email.trim() || isSubscribing}
              className="w-full"
              variant="glow"
            >
              {isSubscribing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Subscribe to Alerts
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
