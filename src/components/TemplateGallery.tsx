import { useState, useEffect } from "react";
import { Search, Filter, Download, FileText, Calendar, Folder } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TemplateDetail } from "./TemplateDetail";

interface Template {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  type: string;
  file_type: string;
  file_size: string;
  download_count: number;
  created_at: string;
  is_featured: boolean;
}

export function TemplateGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const { toast } = useToast();

  const categories = ["All", "Structure", "Government", "Financial", "Planning", "Communication"];
  const types = ["All", "Document Template", "Spreadsheet", "Presentation", "Markdown Template"];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || template.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesType = selectedType === "all" || template.type.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDownloadTemplate = async (template: Template) => {
    try {
      // Create and download file
      const blob = new Blob([template.content || ''], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.title}.${template.file_type?.toLowerCase() || 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update download count
      await supabase
        .from('templates')
        .update({ download_count: template.download_count + 1 })
        .eq('id', template.id);

      // Track interaction
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_interactions')
          .insert({
            user_id: user.id,
            interaction_type: 'copy',
            item_type: 'template',
            item_id: template.id
          });
      }

      // Update local state
      setTemplates(prev => prev.map(t => 
        t.id === template.id ? { ...t, download_count: t.download_count + 1 } : t
      ));

      toast({
        title: "Download Started",
        description: `"${template.title}" has been downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading template:', error);
      toast({
        title: "Error",
        description: "Failed to download template.",
        variant: "destructive",
      });
    }
  };

  if (selectedTemplateId) {
    return (
      <TemplateDetail
        templateId={selectedTemplateId}
        onBack={() => setSelectedTemplateId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Template Gallery</h1>
            <p className="text-muted-foreground">
              Professional templates to streamline your grant writing process
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">{filteredTemplates.length}</div>
            <div className="text-sm text-muted-foreground">Available Templates</div>
          </div>
        </div>

        {/* Search and Filters */}
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
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="glass-button">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="glass-button">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading templates...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="glass-card p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedTemplateId(template.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">{template.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">{template.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-white/5 text-xs">
                  <Folder className="w-3 h-3 mr-1" />
                  {template.category}
                </Badge>
                <Badge variant="outline" className="bg-white/5 text-xs">
                  {template.type}
                </Badge>
                <Badge variant="outline" className="bg-white/5 text-xs">
                  {template.file_type} • {template.file_size}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {template.download_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(template.created_at).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadTemplate(template);
                  }}
                  size="sm"
                  className="glass-button opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}