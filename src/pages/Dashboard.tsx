import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { PromptLibrary } from "@/components/PromptLibrary";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";

export type DashboardView = 'dashboard' | 'prompts' | 'workflow';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardContent onNavigate={setCurrentView} />;
      case 'prompts':
        return <PromptLibrary />;
      case 'workflow':
        return <WorkflowBuilder />;
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