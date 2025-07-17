import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GitBranch, BarChart3, Calendar, CheckCircle2, Clock, TrendingUp, Plus, Target } from "lucide-react";
import { DashboardView } from "@/pages/Dashboard";
import { WorkflowManager } from "@/components/WorkflowManager";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";

interface DashboardContentProps {
  onNavigate: (view: DashboardView) => void;
}

export const DashboardContent = ({ onNavigate }: DashboardContentProps) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [showWorkflowManager, setShowWorkflowManager] = useState(true);

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
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToManager}>
            ← Back to Workflows
          </Button>
          <h1 className="text-2xl font-bold">Grant Writing Workflow</h1>
        </div>
        <WorkflowBuilder workflowId={selectedWorkflowId} />
      </div>
    );
  }

  if (!showWorkflowManager) {
    return <WorkflowManager onSelectWorkflow={handleSelectWorkflow} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Grant Writing Assistant Dashboard</h1>
        <p className="text-muted-foreground">Manage your grant workflows, access AI prompts, and streamline your funding applications.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowWorkflowManager(false)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Workflows</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Create and track your grant applications</p>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              View Workflows
            </Button>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('workflow')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Start Workflow</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Follow our step-by-step grant writing guide</p>
            <Button variant="outline" size="sm" className="w-full">
              Begin Now
            </Button>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('prompts')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Prompts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Access our library of proven AI prompts</p>
            <Button variant="outline" size="sm" className="w-full">
              Browse Library
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Grants in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prompts Available</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50+</div>
            <p className="text-xs text-muted-foreground">AI writing prompts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Workflow progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40%</div>
            <p className="text-xs text-muted-foreground">Faster grant writing</p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Follow these steps to maximize your grant writing success</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">1</div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Create Your First Workflow</h4>
                <p className="text-xs text-muted-foreground mt-1">Start by creating a workflow for your grant application to track progress through our 13-step process.</p>
                <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => setShowWorkflowManager(false)}>
                  Create Workflow →
                </Button>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">2</div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Explore AI Prompts</h4>
                <p className="text-xs text-muted-foreground mt-1">Browse our curated library of AI prompts designed specifically for grant writing success.</p>
                <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => onNavigate('prompts')}>
                  Browse Prompts →
                </Button>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">3</div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Follow the Workflow Guide</h4>
                <p className="text-xs text-muted-foreground mt-1">Use our interactive step-by-step guide to draft compelling grant proposals efficiently.</p>
                <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => onNavigate('workflow')}>
                  Start Guide →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};