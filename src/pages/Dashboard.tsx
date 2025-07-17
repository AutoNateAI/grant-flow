import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { PromptLibrary } from "@/components/PromptLibrary";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { WorkflowManager } from "@/components/WorkflowManager";

export type DashboardView = 'dashboard' | 'prompts' | 'workflow' | 'manage-workflows';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardContent onNavigate={setCurrentView} />;
      case 'prompts':
        return <PromptLibrary />;
      case 'workflow':
        return <WorkflowBuilder workflowId={selectedWorkflowId} />;
      case 'manage-workflows':
        return <WorkflowManager onSelectWorkflow={(id) => {
          setSelectedWorkflowId(id);
          setCurrentView('workflow');
        }} />;
      default:
        return <DashboardContent onNavigate={setCurrentView} />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;