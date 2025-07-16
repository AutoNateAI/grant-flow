import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, MessageCircle, ThumbsUp, Award, TrendingUp } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  title: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const topUsers: User[] = [
  { id: "1", name: "Dr. Sarah Chen", avatar: "/avatars/01.png", level: 42, xp: 8750, title: "Grant Master" },
  { id: "2", name: "Prof. Michael Rodriguez", avatar: "/avatars/02.png", level: 38, xp: 7320, title: "Funding Expert" },
  { id: "3", name: "Dr. Emily Johnson", avatar: "/avatars/03.png", level: 35, xp: 6890, title: "Research Innovator" },
];

const recentAchievements: Achievement[] = [
  { id: "1", title: "Copy Master", description: "Copied 100+ prompts", points: 500, icon: "📋", rarity: "rare" },
  { id: "2", title: "Template Collector", description: "Downloaded 50+ templates", points: 300, icon: "📚", rarity: "common" },
  { id: "3", title: "Community Helper", description: "Helped 25+ researchers", points: 750, icon: "🤝", rarity: "epic" },
];

const communityStats = [
  { label: "Total Prompts Used", value: "47,329", change: "+12%" },
  { label: "Templates Downloaded", value: "23,891", change: "+8%" },
  { label: "Active Researchers", value: "3,247", change: "+15%" },
  { label: "Success Stories", value: "892", change: "+23%" },
];

export function CommunityBoard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <h1 className="text-3xl font-bold gradient-text mb-2">Community Board</h1>
        <p className="text-muted-foreground">
          Connect with fellow researchers and celebrate achievements together
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {communityStats.map((stat, i) => (
          <Card key={i} className="glass-card p-4 interactive-card">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Top Performers */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold">Top Performers This Month</h2>
        </div>
        
        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div key={user.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 interactive-card">
              <div className="text-2xl font-bold text-accent">#{index + 1}</div>
              
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.title}</p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-primary/20 text-primary">
                    Level {user.level}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{user.xp.toLocaleString()} XP</div>
              </div>
              
              <Button variant="outline" className="glass-button">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-semibold">Recent Community Achievements</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentAchievements.map((achievement) => (
            <Card key={achievement.id} className="glass-card p-4 interactive-card">
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h3 className="font-semibold mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                
                <div className="flex items-center justify-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${
                      achievement.rarity === "legendary" ? "bg-amber-500/20 text-amber-500 border-amber-500/30" :
                      achievement.rarity === "epic" ? "bg-purple-500/20 text-purple-500 border-purple-500/30" :
                      achievement.rarity === "rare" ? "bg-blue-500/20 text-blue-500 border-blue-500/30" :
                      "bg-white/10"
                    }`}
                  >
                    {achievement.rarity}
                  </Badge>
                  <span className="text-sm font-medium">+{achievement.points} XP</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Community Feed */}
      <Card className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Activity Feed</h2>
        
        <div className="space-y-4">
          {[
            { user: "Dr. Sarah Chen", action: "unlocked", item: "Grant Master achievement", time: "2 hours ago", type: "achievement" },
            { user: "Prof. Michael R.", action: "shared", item: "NSF Proposal Template", time: "4 hours ago", type: "share" },
            { user: "Dr. Emily Johnson", action: "commented on", item: "Budget Planning Discussion", time: "6 hours ago", type: "comment" },
            { user: "Dr. Alex Kim", action: "reached", item: "Level 25", time: "8 hours ago", type: "level" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === "achievement" ? "bg-accent/20 text-accent" :
                activity.type === "share" ? "bg-primary/20 text-primary" :
                activity.type === "comment" ? "bg-secondary/20 text-secondary" :
                "bg-success/20 text-success"
              }`}>
                {activity.type === "achievement" && <Trophy className="w-4 h-4" />}
                {activity.type === "share" && <Star className="w-4 h-4" />}
                {activity.type === "comment" && <MessageCircle className="w-4 h-4" />}
                {activity.type === "level" && <TrendingUp className="w-4 h-4" />}
              </div>
              
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium text-foreground">{activity.user}</span>
                  <span className="text-muted-foreground"> {activity.action} </span>
                  <span className="text-primary">"{activity.item}"</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              
              <Button variant="outline" size="sm" className="glass-button">
                <ThumbsUp className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}