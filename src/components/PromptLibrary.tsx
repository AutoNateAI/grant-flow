import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Copy, Heart, Edit, ThumbsDown, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  uses: number;
  favorites: number;
  rating: number;
}

const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "Funding Alignment Analysis",
    description: "Analyze how your research aligns with funder priorities",
    content: "Analyze my research focus on [YOUR TOPIC] and the priorities of [FUNDING AGENCY] as described in the following guidelines...",
    category: "Strategic Planning",
    tags: ["alignment", "analysis", "strategy"],
    uses: 1247,
    favorites: 89,
    rating: 4.8
  },
  {
    id: "2", 
    title: "Background & Significance",
    description: "Draft compelling background sections for grant proposals",
    content: "Draft a background and significance section (approximately 750-1000 words) for my grant proposal on [RESEARCH TOPIC]...",
    category: "Content Generation",
    tags: ["background", "significance", "writing"],
    uses: 892,
    favorites: 67,
    rating: 4.6
  },
  {
    id: "3",
    title: "Specific Aims Generator", 
    description: "Generate well-structured specific aims for your proposal",
    content: "Based on my research focus: [BRIEF PROJECT DESCRIPTION] Generate 3-4 specific aims for a [DURATION]-year grant proposal...",
    category: "Content Generation",
    tags: ["aims", "objectives", "structure"],
    uses: 743,
    favorites: 52,
    rating: 4.7
  }
];

export function PromptLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { toast } = useToast();

  const categories = ["All", "Strategic Planning", "Content Generation", "Refinement", "Quality Assurance"];

  const filteredPrompts = mockPrompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast({
        title: "Prompt copied!",
        description: "The prompt has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <h1 className="text-3xl font-bold gradient-text mb-2">Prompt Library</h1>
        <p className="text-muted-foreground">
          Discover and use AI prompts to accelerate your grant writing process
        </p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-button"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`glass-button ${selectedCategory === category ? "bg-primary/20 border-primary/30" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="glass-card p-6 interactive-card">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{prompt.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{prompt.description}</p>
                  <Badge variant="secondary" className="bg-primary/20 text-primary mb-3">
                    {prompt.category}
                  </Badge>
                </div>
                <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                  <span>⭐ {prompt.rating}</span>
                  <span>❤️ {prompt.favorites}</span>
                  <span>📋 {prompt.uses}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs bg-white/5">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="bg-muted/10 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {prompt.content}
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="glass-button flex-1"
                  onClick={() => handleCopy(prompt)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" className="glass-button">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="glass-button">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="glass-button">
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}