import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { PromptLibrary } from "@/components/PromptLibrary";
import { TemplateGallery } from "@/components/TemplateGallery";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { CommunityBoard } from "@/components/CommunityBoard";
import { FavoritesPage } from "@/components/FavoritesPage";
import { UserProfile } from "@/components/UserProfile";
import { SetupWizard } from "@/components/SetupWizard";

export type DashboardView = 'dashboard' | 'prompts' | 'templates' | 'workflow' | 'community' | 'favorites' | 'profile';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const [showSetupWizard, setShowSetupWizard] = useState(true); // In real app, check if user is new

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardContent onNavigate={setCurrentView} />;
      case 'prompts':
        return <PromptLibrary />;
      case 'templates':
        return <TemplateGallery />;
      case 'workflow':
        return <WorkflowBuilder />;
      case 'community':
        return <CommunityBoard />;
      case 'favorites':
        return <FavoritesPage />;
      case 'profile':
        return <UserProfile />;
      default:
        return <DashboardContent onNavigate={setCurrentView} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
        
        {showSetupWizard && (
          <SetupWizard onComplete={() => setShowSetupWizard(false)} />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;