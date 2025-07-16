import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Copy, CheckCircle, Circle, ArrowRight, Lightbulb, FileText, Clock, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  phase: string;
  estimatedTime: string;
  isCompleted: boolean;
  prompts?: string[];
  templates?: string[];
  content?: string;
  tips?: string[];
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "research-setup",
    title: "Research Environment Setup",
    description: "Create a dedicated workspace and import relevant documents",
    phase: "Preparation",
    estimatedTime: "30 minutes",
    isCompleted: false,
    content: `Create a dedicated workspace in NotebookLM or similar tool and import:
• Previous successful grant examples
• Funder guidelines and priorities  
• Your preliminary data and publications
• Any feedback from previous submissions`,
    tips: [
      "Organize all documents in a single workspace for easy access",
      "Use consistent naming conventions for your files",
      "Keep original guidelines documents separate from your working drafts"
    ]
  },
  {
    id: "funding-analysis",
    title: "Funding Alignment Analysis",
    description: "Analyze how your research aligns with the funder's priorities",
    phase: "Preparation", 
    estimatedTime: "45 minutes",
    isCompleted: false,
    prompts: ["funding-alignment-analysis"],
    content: `Use AI to analyze the alignment between your research and the funder's priorities. This critical step ensures your proposal speaks the funder's language and addresses their specific interests.`,
    tips: [
      "Focus on terminology the funder uses in their guidelines",
      "Identify specific programs or initiatives your work supports",
      "Note any recent announcements or priority shifts from the funder"
    ]
  },
  {
    id: "proposal-structure",
    title: "Proposal Structure Generation", 
    description: "Create a tailored outline based on funder guidelines",
    phase: "Strategic Planning",
    estimatedTime: "30 minutes",
    isCompleted: false,
    prompts: ["proposal-structure-generator"],
    templates: ["grant-proposal-template"],
    content: `Generate a customized proposal structure that follows the funder's specific requirements while highlighting your research strengths.`,
    tips: [
      "Pay attention to word/page limits for each section",
      "Note required vs. optional sections",
      "Plan for visual elements and data presentations"
    ]
  },
  {
    id: "research-narrative",
    title: "Develop Core Research Narrative",
    description: "Craft a compelling story that connects problem to solution",
    phase: "Strategic Planning",
    estimatedTime: "60 minutes", 
    isCompleted: false,
    prompts: ["research-narrative-builder"],
    content: `Develop the central narrative that will thread through your entire proposal, connecting the significance of the problem to your innovative solution.`,
    tips: [
      "Start with a hook that grabs reviewer attention",
      "Clearly articulate the gap your research fills",
      "Connect to broader societal or scientific impacts"
    ]
  },
  {
    id: "background-section",
    title: "Background & Significance Section",
    description: "Establish the importance and context of your research",
    phase: "Content Generation",
    estimatedTime: "90 minutes",
    isCompleted: false,
    prompts: ["background-significance-writer"],
    content: `Draft a compelling background section that establishes the critical importance of your research problem and positions your approach as the logical next step.`,
    tips: [
      "Use recent, high-impact citations",
      "Avoid simply summarizing literature - synthesize it",
      "End with a clear statement of the gap you'll address"
    ]
  },
  {
    id: "aims-objectives", 
    title: "Aims and Objectives",
    description: "Define clear, measurable, and achievable research goals",
    phase: "Content Generation",
    estimatedTime: "75 minutes",
    isCompleted: false,
    prompts: ["aims-objectives-generator"],
    content: `Create specific aims that are independent, feasible, and collectively address your research question while fitting within the proposed timeframe.`,
    tips: [
      "Each aim should be testable and have clear success metrics",
      "Aims should build on each other but not depend on prior success",
      "Include potential alternative approaches for risky elements"
    ]
  },
  {
    id: "methods-section",
    title: "Methods Section",
    description: "Detail your experimental approach and methodology",
    phase: "Content Generation", 
    estimatedTime: "120 minutes",
    isCompleted: false,
    prompts: ["methods-section-writer"],
    content: `Provide detailed methodology that demonstrates feasibility while showing innovation and rigor in your experimental design.`,
    tips: [
      "Include preliminary data to show feasibility",
      "Address potential technical challenges",
      "Reference your expertise and available resources"
    ]
  },
  {
    id: "budget-justification",
    title: "Budget Justification",
    description: "Create detailed budget with clear justifications",
    phase: "Content Generation",
    estimatedTime: "60 minutes", 
    isCompleted: false,
    prompts: ["budget-justification-writer"],
    templates: ["budget-template"],
    content: `Develop a realistic budget that directly supports your research aims with clear justification for every expense.`,
    tips: [
      "Be specific about personnel time allocations",
      "Include equipment maintenance and calibration costs",
      "Factor in inflation for multi-year budgets"
    ]
  },
  {
    id: "reviewer-analysis",
    title: "Reviewer Perspective Analysis", 
    description: "Review your draft from a critical reviewer's viewpoint",
    phase: "Refinement",
    estimatedTime: "45 minutes",
    isCompleted: false,
    prompts: ["reviewer-perspective-analyzer"],
    content: `Take a step back and critically evaluate your proposal as an experienced reviewer would, identifying potential weaknesses and areas for improvement.`,
    tips: [
      "Look for unsupported claims or logical gaps",
      "Check that methodology matches stated aims",
      "Ensure innovation is clearly articulated"
    ]
  },
  {
    id: "visual-assets",
    title: "Visual Asset Development",
    description: "Create figures, charts, and visual aids",
    phase: "Refinement",
    estimatedTime: "90 minutes",
    isCompleted: false,
    prompts: ["visual-asset-planner"],
    content: `Develop clear, professional visual elements that enhance understanding and make complex concepts accessible to reviewers.`,
    tips: [
      "Use consistent styling across all figures",
      "Include detailed, informative captions",
      "Make sure visuals are readable when printed in black and white"
    ]
  },
  {
    id: "executive-summary",
    title: "Executive Summary Creation",
    description: "Write a compelling summary that hooks reviewers",
    phase: "Finalization",
    estimatedTime: "45 minutes",
    isCompleted: false,
    prompts: ["executive-summary-writer"],
    content: `Craft an engaging executive summary that captures the essence of your proposal and motivates reviewers to read further.`,
    tips: [
      "Start with the problem's significance",
      "Clearly state your innovative approach",
      "End with expected impact and broader implications"
    ]
  },
  {
    id: "coherence-check",
    title: "Coherence and Flow Check",
    description: "Ensure logical flow and consistency throughout",
    phase: "Finalization",
    estimatedTime: "60 minutes",
    isCompleted: false,
    prompts: ["coherence-flow-checker"],
    content: `Review your complete proposal for logical consistency, smooth transitions, and a coherent narrative thread that connects all sections.`,
    tips: [
      "Check that conclusions match your stated aims",
      "Ensure consistent terminology throughout",
      "Verify that each section builds logically on previous ones"
    ]
  },
  {
    id: "final-qa",
    title: "Final Quality Assurance",
    description: "Comprehensive final review for submission readiness",
    phase: "Finalization", 
    estimatedTime: "90 minutes",
    isCompleted: false,
    prompts: ["final-quality-checker"],
    content: `Conduct a thorough final review to ensure your proposal meets all requirements and presents your research in the best possible light.`,
    tips: [
      "Double-check all formatting requirements",
      "Verify all references are complete and correctly formatted",
      "Have a colleague review for clarity and completeness"
    ]
  }
];

export function WorkflowBuilder() {
  const [steps, setSteps] = useState<WorkflowStep[]>(workflowSteps);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrompts();
    fetchTemplates();
    loadUserProgress();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('id, title, content, category');
      
      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('id, title, content, category');
      
      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const loadUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_workflows')
        .select('workflow_data')
        .eq('user_id', user.id)
        .single();

      if (data?.workflow_data) {
        const workflowData = data.workflow_data as any;
        setSteps(prev => prev.map(step => ({
          ...step,
          isCompleted: workflowData[step.id] || false
        })));
      }
    } catch (error) {
      // No existing workflow data
    }
  };

  const saveUserProgress = async (updatedSteps: WorkflowStep[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const workflowData = updatedSteps.reduce((acc, step) => ({
        ...acc,
        [step.id]: step.isCompleted
      }), {});

      await supabase
        .from('user_workflows')
        .upsert({
          user_id: user.id,
          workflow_data: workflowData
        });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const toggleStepCompletion = (stepId: string) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
    );
    setSteps(updatedSteps);
    saveUserProgress(updatedSteps);
    
    const step = updatedSteps.find(s => s.id === stepId);
    toast({
      title: step?.isCompleted ? "Step completed!" : "Step marked incomplete",
      description: step?.isCompleted ? "Great progress on your grant proposal!" : "Step marked as incomplete.",
    });
  };

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const copyPromptContent = async (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (!prompt) return;

    await navigator.clipboard.writeText(prompt.content);
    toast({
      title: "Prompt copied!",
      description: `"${prompt.title}" copied to clipboard.`,
    });
  };

  const groupedSteps = steps.reduce((acc, step) => {
    if (!acc[step.phase]) {
      acc[step.phase] = [];
    }
    acc[step.phase].push(step);
    return acc;
  }, {} as Record<string, WorkflowStep[]>);

  const completedSteps = steps.filter(step => step.isCompleted).length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  const getPromptsByIds = (promptIds?: string[]) => {
    if (!promptIds) return [];
    return prompts.filter(p => promptIds.some(id => 
      p.title.toLowerCase().includes(id) || p.category.toLowerCase().includes(id)
    ));
  };

  const getTemplatesByIds = (templateIds?: string[]) => {
    if (!templateIds) return [];
    return templates.filter(t => templateIds.some(id => 
      t.title.toLowerCase().includes(id) || t.category.toLowerCase().includes(id)
    ));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Grant Writing Workflow</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Follow this comprehensive AI-assisted workflow to dramatically accelerate and improve your grant writing process. 
          Each step includes specific prompts and templates to guide you through creating compelling, fundable proposals.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Your Progress</h2>
          <Badge variant="outline" className="bg-primary/20 text-primary">
            {completedSteps} of {totalSteps} steps
          </Badge>
        </div>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-muted-foreground">
          {progress.toFixed(0)}% complete - Keep up the great work!
        </p>
      </Card>

      {/* Workflow Steps by Phase */}
      {Object.entries(groupedSteps).map(([phase, phaseSteps]) => (
        <div key={phase} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary-glow"></div>
            <h2 className="text-2xl font-bold">{phase} Phase</h2>
          </div>

          <div className="space-y-4">
            {phaseSteps.map((step, index) => (
              <Card key={step.id} className="glass-card overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleStepExpansion(step.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStepCompletion(step.id);
                        }}
                        className="mt-1 p-0 h-6 w-6"
                      >
                        {step.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-lg font-semibold ${step.isCompleted ? 'text-green-400' : 'text-foreground'}`}>
                            {step.title}
                          </h3>
                          <Badge variant="outline" className="bg-white/5">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.estimatedTime}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                        
                        {(step.prompts || step.templates) && (
                          <div className="flex gap-2 mt-3">
                            {step.prompts && (
                              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                <Lightbulb className="w-3 h-3 mr-1" />
                                {step.prompts.length} Prompt{step.prompts.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                            {step.templates && (
                              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                                <FileText className="w-3 h-3 mr-1" />
                                {step.templates.length} Template{step.templates.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="ml-4">
                      {expandedSteps.has(step.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedSteps.has(step.id) && (
                  <div className="border-t border-white/10 p-6 bg-black/20">
                    {step.content && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Step Details
                        </h4>
                        <div className="prose prose-invert max-w-none">
                          {step.content.split('\n').map((line, i) => {
                            if (line.startsWith('•')) {
                              return (
                                <div key={i} className="flex items-start gap-2 mb-2">
                                  <div className="w-1 h-1 rounded-full bg-accent mt-2"></div>
                                  <span className="text-muted-foreground">{line.substring(1).trim()}</span>
                                </div>
                              );
                            }
                            return line.trim() ? (
                              <p key={i} className="mb-3 text-muted-foreground">{line}</p>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {step.tips && step.tips.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">💡 Pro Tips</h4>
                        <ul className="space-y-2">
                          {step.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ArrowRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                              <span className="text-sm text-muted-foreground">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.prompts && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Related Prompts
                        </h4>
                        <div className="space-y-3">
                          {getPromptsByIds(step.prompts).map((prompt) => (
                            <div key={prompt.id} className="glass-card p-4 bg-blue-500/10 border-blue-500/20">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-blue-400 mb-1">{prompt.title}</h5>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {prompt.content.substring(0, 150)}...
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyPromptContent(prompt.id)}
                                  className="ml-3 glass-button"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.templates && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Related Templates
                        </h4>
                        <div className="space-y-3">
                          {getTemplatesByIds(step.templates).map((template) => (
                            <div key={template.id} className="glass-card p-4 bg-purple-500/10 border-purple-500/20">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-purple-400 mb-1">{template.title}</h5>
                                  <p className="text-xs text-muted-foreground">
                                    {template.category} template
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="ml-3 glass-button"
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Completion Summary */}
      {completedSteps === totalSteps && (
        <Card className="glass-card p-8 text-center bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/30">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-400 mb-2">Workflow Complete!</h2>
          <p className="text-muted-foreground">
            Congratulations! You've completed all steps in the Grant Writing Workflow. 
            Your proposal is now ready for final review and submission.
          </p>
        </Card>
      )}
    </div>
  );
}