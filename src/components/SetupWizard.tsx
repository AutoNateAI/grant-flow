import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle, Lightbulb, FileText, Workflow, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SetupWizardProps {
  onComplete: () => void;
}

interface UserProfile {
  name: string;
  institution: string;
  researchArea: string;
  experience: string;
  goals: string;
}

export function SetupWizard({ onComplete }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    institution: "",
    researchArea: "",
    experience: "",
    goals: ""
  });
  const { toast } = useToast();

  const steps = [
    {
      title: "Welcome to Grant AI",
      description: "Your AI-powered grant writing companion",
      content: "welcome"
    },
    {
      title: "Platform Overview", 
      description: "Discover what you can do here",
      content: "overview"
    },
    {
      title: "Tell Us About Yourself",
      description: "Help us personalize your experience",
      content: "profile"
    },
    {
      title: "You're All Set!",
      description: "Ready to start your grant writing journey",
      content: "complete"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Welcome aboard!",
      description: "Your profile has been set up successfully.",
    });
    onComplete();
  };

  const handleSkip = () => {
    onComplete();
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (steps[currentStep].content) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto floating-animation">
              <Lightbulb className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-4">Welcome to Grant AI!</h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Your comprehensive platform for mastering AI-powered grant writing. Let's get you started on your journey to funding success.
              </p>
            </div>
          </div>
        );

      case "overview":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold gradient-text text-center mb-6">What You Can Do Here</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card p-6 text-center interactive-card">
                <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Prompt Library</h3>
                <p className="text-sm text-muted-foreground">
                  Access 25+ AI prompts designed specifically for grant writing
                </p>
              </Card>
              
              <Card className="glass-card p-6 text-center interactive-card">
                <FileText className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Template Gallery</h3>
                <p className="text-sm text-muted-foreground">
                  Download ready-to-use templates for proposals, budgets, and more
                </p>
              </Card>
              
              <Card className="glass-card p-6 text-center interactive-card">
                <Workflow className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Workflow Builder</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your grant writing process with drag-and-drop workflow cards
                </p>
              </Card>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold gradient-text text-center mb-6">Tell Us About Yourself</h2>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. Jane Smith"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="glass-button"
                />
              </div>
              
              <div>
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  placeholder="Stanford University"
                  value={profile.institution}
                  onChange={(e) => setProfile({...profile, institution: e.target.value})}
                  className="glass-button"
                />
              </div>
              
              <div>
                <Label htmlFor="researchArea">Research Area</Label>
                <Input
                  id="researchArea"
                  placeholder="Computational Biology"
                  value={profile.researchArea}
                  onChange={(e) => setProfile({...profile, researchArea: e.target.value})}
                  className="glass-button"
                />
              </div>
              
              <div>
                <Label htmlFor="goals">What are your grant writing goals?</Label>
                <Textarea
                  id="goals"
                  placeholder="I want to improve my success rate with federal grants..."
                  value={profile.goals}
                  onChange={(e) => setProfile({...profile, goals: e.target.value})}
                  className="glass-button"
                />
              </div>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success to-accent flex items-center justify-center mx-auto floating-animation">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-4">You're All Set!</h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Welcome to Grant AI, {profile.name || "researcher"}! You're ready to start accelerating your grant writing process with AI-powered tools.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="glass-button">
                <Lightbulb className="w-4 h-4 mr-2" />
                Browse Prompts
              </Button>
              <Button variant="outline" className="glass-button">
                <FileText className="w-4 h-4 mr-2" />
                View Templates
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="glass-card max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{steps[currentStep].title}</DialogTitle>
              <DialogDescription>{steps[currentStep].description}</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="py-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="glass-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Setup
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button onClick={handleComplete} className="glass-button">
                <CheckCircle className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            ) : (
              <Button onClick={nextStep} className="glass-button">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}