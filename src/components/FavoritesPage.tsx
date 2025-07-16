import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Copy, Download, Trash2, FileText, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FavoritePrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  dateAdded: string;
}

interface FavoriteTemplate {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  dateAdded: string;
}

const favoritePrompts: FavoritePrompt[] = [
  {
    id: "1",
    title: "Funding Alignment Analysis",
    description: "Analyze how your research aligns with funder priorities",
    category: "Strategic Planning",
    content: "Analyze my research focus on [YOUR TOPIC] and the priorities of [FUNDING AGENCY]...",
    dateAdded: "2024-01-15"
  },
  {
    id: "2", 
    title: "Background & Significance",
    description: "Draft compelling background sections for grant proposals",
    category: "Content Generation",
    content: "Draft a background and significance section (approximately 750-1000 words)...",
    dateAdded: "2024-01-14"
  }
];

const favoriteTemplates: FavoriteTemplate[] = [
  {
    id: "1",
    title: "NIH Grant Proposal Template",
    description: "Complete template for NIH R01 grant applications",
    type: "Notion Template",
    category: "Federal Grants", 
    dateAdded: "2024-01-13"
  },
  {
    id: "2",
    title: "Budget Spreadsheet Template",
    description: "Excel template for grant budget planning",
    type: "Excel File",
    category: "Budget Planning",
    dateAdded: "2024-01-12"
  }
];

export function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("prompts");
  const { toast } = useToast();

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Content copied!",
        description: "The content has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFavorite = (id: string, type: "prompt" | "template") => {
    toast({
      title: "Removed from favorites",
      description: `The ${type} has been removed from your favorites.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-accent" />
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">My Favorites</h1>
            <p className="text-muted-foreground">
              Access your saved prompts and templates in one place
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass-card p-1 mb-6">
          <TabsTrigger value="prompts" className="glass-button">
            <Lightbulb className="w-4 h-4 mr-2" />
            Prompts ({favoritePrompts.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="glass-button">
            <FileText className="w-4 h-4 mr-2" />
            Templates ({favoriteTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompts" className="space-y-4">
          {favoritePrompts.length === 0 ? (
            <Card className="glass-card p-12 text-center">
              <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No favorite prompts yet</h3>
              <p className="text-muted-foreground">
                Start exploring our prompt library and save your favorites for quick access.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {favoritePrompts.map((prompt) => (
                <Card key={prompt.id} className="glass-card p-6 interactive-card">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{prompt.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{prompt.description}</p>
                        <Badge variant="secondary" className="bg-primary/20 text-primary">
                          {prompt.category}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-button text-destructive"
                        onClick={() => handleRemoveFavorite(prompt.id, "prompt")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="bg-muted/10 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {prompt.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Added {new Date(prompt.dateAdded).toLocaleDateString()}
                      </span>
                      <Button 
                        className="glass-button"
                        onClick={() => handleCopy(prompt.content)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {favoriteTemplates.length === 0 ? (
            <Card className="glass-card p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No favorite templates yet</h3>
              <p className="text-muted-foreground">
                Browse our template gallery and save useful templates for future use.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {favoriteTemplates.map((template) => (
                <Card key={template.id} className="glass-card interactive-card overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 p-4 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-primary/60" />
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{template.description}</p>
                        
                        <div className="flex gap-2 mb-3">
                          <Badge variant="secondary" className="bg-primary/20 text-primary">
                            {template.category}
                          </Badge>
                          <Badge variant="outline" className="bg-white/5">
                            {template.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Added {new Date(template.dateAdded).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button className="glass-button">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-button text-destructive"
                          onClick={() => handleRemoveFavorite(template.id, "template")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}