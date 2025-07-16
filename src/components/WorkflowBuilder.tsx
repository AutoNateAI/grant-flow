import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, Trash2, Edit3, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  phase: string;
  estimatedTime: string;
  isCompleted: boolean;
  isCustom: boolean;
}

const defaultWorkflowSteps: WorkflowStep[] = [
  {
    id: "1",
    title: "Research Environment Setup",
    description: "Create dedicated workspace and import relevant materials",
    phase: "Preparation",
    estimatedTime: "30 mins",
    isCompleted: false,
    isCustom: false
  },
  {
    id: "2",
    title: "Funding Alignment Analysis", 
    description: "Analyze how research aligns with funder priorities",
    phase: "Preparation",
    estimatedTime: "45 mins",
    isCompleted: false,
    isCustom: false
  },
  {
    id: "3",
    title: "Proposal Structure Generation",
    description: "Create tailored structure based on guidelines",
    phase: "Strategic Planning", 
    estimatedTime: "60 mins",
    isCompleted: false,
    isCustom: false
  },
  {
    id: "4",
    title: "Core Research Narrative",
    description: "Develop compelling research narrative",
    phase: "Strategic Planning",
    estimatedTime: "90 mins", 
    isCompleted: false,
    isCustom: false
  }
];

export function WorkflowBuilder() {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(defaultWorkflowSteps);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const phases = ["Preparation", "Strategic Planning", "Content Generation", "Refinement", "Finalization"];

  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    setDraggedItem(stepId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedIndex = workflowSteps.findIndex(step => step.id === draggedItem);
    const targetIndex = workflowSteps.findIndex(step => step.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSteps = [...workflowSteps];
    const [draggedStep] = newSteps.splice(draggedIndex, 1);
    newSteps.splice(targetIndex, 0, draggedStep);

    setWorkflowSteps(newSteps);
    setDraggedItem(null);
    
    toast({
      title: "Workflow updated",
      description: "Step order has been changed successfully.",
    });
  };

  const addCustomStep = () => {
    if (!newStepTitle.trim()) return;

    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      title: newStepTitle,
      description: "Custom step added by user",
      phase: "Custom",
      estimatedTime: "30 mins",
      isCompleted: false,
      isCustom: true
    };

    setWorkflowSteps([...workflowSteps, newStep]);
    setNewStepTitle("");
    setShowAddForm(false);
    
    toast({
      title: "Step added",
      description: "New custom step has been added to your workflow.",
    });
  };

  const deleteStep = (stepId: string) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId));
    toast({
      title: "Step deleted",
      description: "The step has been removed from your workflow.",
    });
  };

  const toggleStepCompletion = (stepId: string) => {
    setWorkflowSteps(workflowSteps.map(step => 
      step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
    ));
  };

  const groupedSteps = phases.reduce((acc, phase) => {
    acc[phase] = workflowSteps.filter(step => step.phase === phase);
    return acc;
  }, {} as Record<string, WorkflowStep[]>);

  // Add custom steps that don't fit into default phases
  const customSteps = workflowSteps.filter(step => !phases.includes(step.phase));
  if (customSteps.length > 0) {
    groupedSteps["Custom"] = customSteps;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Workflow Builder</h1>
            <p className="text-muted-foreground">
              Customize your grant writing workflow by reordering or adding steps
            </p>
          </div>
          <Button 
            className="glass-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>
      </div>

      {/* Add Step Form */}
      {showAddForm && (
        <Card className="glass-card p-6">
          <div className="flex gap-4">
            <Input
              placeholder="Enter step title..."
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              className="glass-button flex-1"
            />
            <Button onClick={addCustomStep} className="glass-button">
              <Save className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </Card>
      )}

      {/* Workflow Steps by Phase */}
      <div className="space-y-8">
        {Object.entries(groupedSteps).map(([phase, steps]) => (
          <div key={phase} className="space-y-4">
            <h2 className="text-xl font-semibold gradient-text">{phase} Phase</h2>
            <div className="grid gap-4">
              {steps.map((step, index) => (
                <Card
                  key={step.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, step.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, step.id)}
                  className={`glass-card p-4 cursor-move transition-all duration-300 ${
                    step.isCompleted ? "bg-success/10 border-success/30" : ""
                  } ${draggedItem === step.id ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                    
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => toggleStepCompletion(step.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          step.isCompleted 
                            ? "bg-success border-success text-white" 
                            : "border-muted-foreground"
                        }`}>
                          {step.isCompleted && "✓"}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className={`font-semibold ${step.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="bg-white/5">
                            {step.estimatedTime}
                          </Badge>
                          {step.isCustom && (
                            <Badge variant="secondary" className="bg-accent/20 text-accent">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-button"
                        onClick={() => setEditingStep(step.id)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      {step.isCustom && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-button text-destructive"
                          onClick={() => deleteStep(step.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-4">Progress Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">
              {workflowSteps.filter(s => s.isCompleted).length}
            </div>
            <div className="text-sm text-muted-foreground">Completed Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">
              {workflowSteps.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">
              {Math.round((workflowSteps.filter(s => s.isCompleted).length / workflowSteps.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">
              {workflowSteps.filter(s => s.isCustom).length}
            </div>
            <div className="text-sm text-muted-foreground">Custom Steps</div>
          </div>
        </div>
      </Card>
    </div>
  );
}