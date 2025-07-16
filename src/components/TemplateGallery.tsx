import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Heart, Eye, Filter, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  downloads: number;
  favorites: number;
  rating: number;
  preview: string;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    title: "NIH Grant Proposal Template",
    description: "Complete template for NIH R01 grant applications with all required sections",
    type: "Notion Template",
    category: "Federal Grants",
    downloads: 2341,
    favorites: 189,
    rating: 4.9,
    preview: "# Grant Proposal Template\n\n## Abstract/Executive Summary\n[250-300 words that summarize the entire proposal]\n\n## 1. Introduction and Background..."
  },
  {
    id: "2",
    title: "Budget Spreadsheet Template",
    description: "Excel template for grant budget planning with automatic calculations",
    type: "Excel File",
    category: "Budget Planning",
    downloads: 1876,
    favorites: 156,
    rating: 4.7,
    preview: "Year 1 | Year 2 | Year 3 | Total\nPersonnel | Equipment | Supplies | Travel..."
  },
  {
    id: "3",
    title: "Timeline & Milestones Template",
    description: "Gantt chart template for project planning and milestone tracking",
    type: "Google Sheets",
    category: "Project Management",
    downloads: 1432,
    favorites: 98,
    rating: 4.6,
    preview: "Q1 | Q2 | Q3 | Q4\nAim 1 Activities | Aim 2 Activities | Aim 3 Activities..."
  }
];

export function TemplateGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const { toast } = useToast();

  const categories = ["All", "Federal Grants", "Budget Planning", "Project Management", "Writing Templates"];
  const types = ["All", "Notion Template", "Excel File", "Google Sheets", "Word Document"];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesType = selectedType === "All" || template.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDownload = (template: Template) => {
    toast({
      title: "Template downloaded!",
      description: `${template.title} has been downloaded to your device.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <h1 className="text-3xl font-bold gradient-text mb-2">Template Gallery</h1>
        <p className="text-muted-foreground">
          Download ready-to-use templates to streamline your grant writing workflow
        </p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 rounded-xl">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-button"
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground flex items-center">Category:</span>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={`glass-button ${selectedCategory === category ? "bg-primary/20 border-primary/30" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground flex items-center">Type:</span>
              {types.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  className={`glass-button ${selectedType === type ? "bg-secondary/20 border-secondary/30" : ""}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="glass-card interactive-card overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 p-6 flex items-center justify-center">
              <FileText className="w-16 h-16 text-primary/60" />
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{template.title}</h3>
                  <div className="text-sm text-muted-foreground">
                    ⭐ {template.rating}
                  </div>
                </div>
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

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>📥 {template.downloads}</span>
                <span>❤️ {template.favorites}</span>
              </div>

              <div className="bg-muted/10 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono line-clamp-3">
                  {template.preview}
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="glass-button flex-1"
                  onClick={() => handleDownload(template)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="glass-button">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="glass-button">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}