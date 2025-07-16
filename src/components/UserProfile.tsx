import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { User, Edit3, Save, Trophy, Target, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  promptsCopied: number;
  templatesDownloaded: number;
  workflowsCompleted: number;
  achievements: number;
  joinDate: string;
}

const userStats: UserStats = {
  level: 12,
  xp: 2847,
  xpToNextLevel: 3000,
  promptsCopied: 127,
  templatesDownloaded: 23,
  workflowsCompleted: 8,
  achievements: 15,
  joinDate: "2024-01-01"
};

const achievements = [
  { id: "1", title: "First Steps", description: "Completed your first workflow", icon: "🚀", unlocked: true },
  { id: "2", title: "Copy Master", description: "Copied 100+ prompts", icon: "📋", unlocked: true },
  { id: "3", title: "Template Collector", description: "Downloaded 20+ templates", icon: "📚", unlocked: true },
  { id: "4", title: "Week Warrior", description: "7-day learning streak", icon: "🔥", unlocked: true },
  { id: "5", title: "Community Helper", description: "Helped 10+ researchers", icon: "🤝", unlocked: false },
  { id: "6", title: "Grant Master", description: "Completed all advanced modules", icon: "🎓", unlocked: false },
];

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Dr. Sarah Smith",
    email: "sarah.smith@university.edu",
    institution: "Stanford University", 
    department: "Department of Biology",
    researchArea: "Computational Biology and Machine Learning",
    bio: "Passionate researcher focused on applying AI and machine learning techniques to solve complex biological problems. Currently working on grant proposals for NIH and NSF funding.",
    website: "https://stanford.edu/~ssmith"
  });
  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const progressPercentage = (userStats.xp / userStats.xpToNextLevel) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/avatars/user.png" />
              <AvatarFallback className="text-lg">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold gradient-text">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.institution}</p>
            </div>
          </div>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="glass-button"
          >
            {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? "Save" : "Edit Profile"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                    className="glass-button"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                    className="glass-button"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={profile.institution}
                    onChange={(e) => setProfile({...profile, institution: e.target.value})}
                    disabled={!isEditing}
                    className="glass-button"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile({...profile, department: e.target.value})}
                    disabled={!isEditing}
                    className="glass-button"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="researchArea">Research Area</Label>
                <Input
                  id="researchArea"
                  value={profile.researchArea}
                  onChange={(e) => setProfile({...profile, researchArea: e.target.value})}
                  disabled={!isEditing}
                  className="glass-button"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.website}
                  onChange={(e) => setProfile({...profile, website: e.target.value})}
                  disabled={!isEditing}
                  className="glass-button"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  disabled={!isEditing}
                  className="glass-button min-h-[100px]"
                />
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border ${
                    achievement.unlocked 
                      ? "bg-accent/10 border-accent/30" 
                      : "bg-white/5 border-white/10 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <Badge variant="secondary" className="bg-success/20 text-success">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card className="glass-card p-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">{userStats.level}</span>
              </div>
              <h3 className="font-semibold">Level {userStats.level}</h3>
              <p className="text-sm text-muted-foreground">Research Enthusiast</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>XP Progress</span>
                <span>{userStats.xp}/{userStats.xpToNextLevel}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {userStats.xpToNextLevel - userStats.xp} XP to next level
              </p>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="glass-card p-6">
            <h3 className="font-semibold mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm">Prompts Copied</span>
                </div>
                <span className="font-semibold">{userStats.promptsCopied}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Templates Downloaded</span>
                </div>
                <span className="font-semibold">{userStats.templatesDownloaded}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-accent" />
                  <span className="text-sm">Workflows Completed</span>
                </div>
                <span className="font-semibold">{userStats.workflowsCompleted}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-success" />
                  <span className="text-sm">Achievements</span>
                </div>
                <span className="font-semibold">{userStats.achievements}</span>
              </div>
            </div>
          </Card>

          {/* Member Since */}
          <Card className="glass-card p-6">
            <h3 className="font-semibold mb-2">Member Since</h3>
            <p className="text-muted-foreground">
              {new Date(userStats.joinDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}