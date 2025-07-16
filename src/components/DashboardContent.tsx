import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, Star, TrendingUp, Zap, Lightbulb, FileText, Users } from "lucide-react";
import { DashboardView } from "@/pages/Dashboard";

interface DashboardContentProps {
  onNavigate: (view: DashboardView) => void;
}

export function DashboardContent({ onNavigate }: DashboardContentProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Welcome back, Dr. Smith!
            </h1>
            <p className="text-muted-foreground text-lg">
              Continue your grant writing mastery journey
            </p>
          </div>
          <div className="floating-animation">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-effect">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6 interactive-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Learning Progress</h3>
              <div className="space-y-2">
                <Progress value={75} className="h-2" />
                <p className="text-sm text-muted-foreground">15 of 20 modules completed</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 interactive-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Weekly Streak</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold gradient-text">12 days</span>
                <Badge variant="secondary" className="bg-secondary/20">
                  🔥 On fire!
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 interactive-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">XP Points</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold gradient-text">2,847</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          className="glass-button h-24 flex flex-col gap-2"
          onClick={() => onNavigate('prompts')}
        >
          <Lightbulb className="w-6 h-6" />
          <span>Browse Prompts</span>
        </Button>
        
        <Button 
          className="glass-button h-24 flex flex-col gap-2"
          onClick={() => onNavigate('templates')}
        >
          <FileText className="w-6 h-6" />
          <span>View Templates</span>
        </Button>
        
        <Button 
          className="glass-button h-24 flex flex-col gap-2"
          onClick={() => onNavigate('workflow')}
        >
          <Target className="w-6 h-6" />
          <span>Build Workflow</span>
        </Button>
        
        <Button 
          className="glass-button h-24 flex flex-col gap-2"
          onClick={() => onNavigate('community')}
        >
          <Users className="w-6 h-6" />
          <span>Join Community</span>
        </Button>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: "Copied prompt", item: "Background Analysis Prompt", time: "2 hours ago" },
            { action: "Favorited template", item: "NIH Grant Template", time: "1 day ago" },
            { action: "Completed module", item: "Strategic Planning Phase", time: "2 days ago" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="text-foreground">{activity.action}</span>
                  <span className="text-primary ml-1">"{activity.item}"</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}