import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GitBranch, BarChart3, Calendar, CheckCircle2, Clock, TrendingUp, Plus, Target, Star, Zap, LogOut } from "lucide-react";
import { DashboardView } from "@/pages/Dashboard";
import { WorkflowManager } from "@/components/WorkflowManager";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface DashboardContentProps {
  onNavigate: (view: DashboardView) => void;
  onSelectWorkflow?: (workflowId: string) => void;
}

export const DashboardContent = ({ onNavigate, onSelectWorkflow }: DashboardContentProps) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [showWorkflowManager, setShowWorkflowManager] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [workflowStats, setWorkflowStats] = useState({ total: 0, completed: 0, avgProgress: 0 });
  const [lastWorkflowId, setLastWorkflowId] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchUserProfile();
    fetchWorkflowStats();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchWorkflowStats = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_workflows')
        .select('id, workflow_data, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        return;
      }

      const workflows = data || [];
      const totalWorkflows = workflows.length;
      const completedWorkflows = workflows.filter(w => (w.workflow_data as any)?.progress === 100).length;
      const avgProgress = workflows.length > 0 
        ? Math.round(workflows.reduce((sum, w) => sum + ((w.workflow_data as any)?.progress || 0), 0) / workflows.length)
        : 0;

      // Set the most recently updated workflow as the last workflow
      if (workflows.length > 0) {
        setLastWorkflowId(workflows[0].id);
      }

      setWorkflowStats({
        total: totalWorkflows,
        completed: completedWorkflows,
        avgProgress
      });
    } catch (error) {
      console.error('Error fetching workflow stats:', error);
    }
  };

  const handleSelectWorkflow = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    setShowWorkflowManager(false);
  };

  const handleBackToManager = () => {
    setShowWorkflowManager(true);
    setSelectedWorkflowId(null);
  };

  if (!showWorkflowManager && selectedWorkflowId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToManager}>
              ← Back to Workflows
            </Button>
            <h1 className="text-2xl font-bold">Grant Writing Workflow</h1>
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        <WorkflowBuilder workflowId={selectedWorkflowId} />
      </div>
    );
  }

  if (!showWorkflowManager) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Grant Workflows</h1>
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        <WorkflowManager onSelectWorkflow={handleSelectWorkflow} />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground space-y-8">
      {/* Header with user info and sign out */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {userProfile?.display_name || 'Researcher'}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Continue your grant writing mastery journey
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflow Progress</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{workflowStats.completed} of {workflowStats.total} workflows completed</span>
              </div>
              <Progress value={workflowStats.total > 0 ? (workflowStats.completed / workflowStats.total) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks This Week</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">8 tasks</div>
            <p className="text-xs text-muted-foreground">Completed across all grants</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-blue-400">Literature Review</div>
            <p className="text-xs text-muted-foreground">NIH Grant Application</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card 
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-lg transition-all" 
          onClick={() => {
            if (lastWorkflowId && onSelectWorkflow) {
              onSelectWorkflow(lastWorkflowId);
              onNavigate('workflow');
            } else {
              onNavigate('manage-workflows');
            }
          }}
        >
          <CardContent className="p-6 text-center">
            <GitBranch className="h-8 w-8 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Continue Current Workflow</h3>
            <p className="text-blue-100 text-sm">{lastWorkflowId ? 'Continue your grant writing process' : 'Select a workflow to continue'}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-lg transition-all" onClick={() => onNavigate('manage-workflows')}>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">View Workflows</h3>
            <p className="text-blue-100 text-sm">Manage your grant projects</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-lg transition-all" onClick={() => onNavigate('prompts')}>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Browse Prompts</h3>
            <p className="text-blue-100 text-sm">Access our AI prompt library</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">Copied prompt <span className="text-blue-400">"Background Analysis Prompt"</span></p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">Favorited workflow <span className="text-blue-400">"NIH Grant Workflow"</span></p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};