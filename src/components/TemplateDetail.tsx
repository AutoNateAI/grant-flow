import { useState, useEffect } from "react";
import { ArrowLeft, Download, Heart, MessageCircle, FileText, Tag, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  type: string;
  tags: string[];
  file_type: string;
  file_size: string;
  download_count: number;
  like_count: number;
  is_featured: boolean;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_comment_id?: string;
}

interface TemplateDetailProps {
  templateId: string;
  onBack: () => void;
}

export function TemplateDetail({ templateId, onBack }: TemplateDetailProps) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplateDetail();
    fetchComments();
    checkIfFavorited();
  }, [templateId]);

  const fetchTemplateDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;
      setTemplate(data);
    } catch (error) {
      console.error('Error fetching template:', error);
      toast({
        title: "Error",
        description: "Failed to load template details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('item_type', 'template')
        .eq('item_id', templateId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkIfFavorited = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', 'template')
        .eq('item_id', templateId)
        .single();

      setIsFavorited(!!data);
    } catch (error) {
      // Not favorited
    }
  };

  const handleDownload = async () => {
    if (!template) return;
    
    // Create and download file
    const blob = new Blob([template.content], { type: 'text/plain' });
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
      .eq('id', templateId);

    // Track interaction
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          interaction_type: 'copy',
          item_type: 'template',
          item_id: templateId
        });
    }

    setTemplate(prev => prev ? { ...prev, download_count: prev.download_count + 1 } : null);
    
    toast({
      title: "Downloaded!",
      description: "Template downloaded successfully.",
    });
  };

  const handleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to favorite templates.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_type', 'template')
          .eq('item_id', templateId);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            item_type: 'template',
            item_id: templateId
          });
      }

      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited ? "Template removed from your favorites." : "Template added to your favorites.",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites.",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          item_type: 'template',
          item_id: templateId,
          content: newComment.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
      setNewComment("");
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (!template) {
    return <div className="text-center">Template not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="glass-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gallery
        </Button>
      </div>

      <Card className="glass-card p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold gradient-text mb-2">{template.title}</h1>
            <p className="text-muted-foreground text-lg">{template.description}</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleFavorite}
              className={`glass-button ${isFavorited ? "text-red-500 border-red-500" : ""}`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
            </Button>
            <Button onClick={handleDownload} className="glass-button">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Badge variant="outline" className="bg-white/5">
            <Tag className="w-3 h-3 mr-1" />
            {template.category}
          </Badge>
          <Badge variant="outline" className="bg-white/5">
            <FileText className="w-3 h-3 mr-1" />
            {template.type}
          </Badge>
          <Badge variant="outline" className="bg-white/5">
            {template.file_type} • {template.file_size}
          </Badge>
          {template.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-accent/20 text-accent">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Template Content Preview</h3>
          <div className="glass-card p-4 bg-black/20 rounded-lg max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm">{template.content}</pre>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Download className="w-4 h-4" />
              <span>{template.download_count} downloads</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(template.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Comments Section */}
      <Card className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </h3>

        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="glass-card p-4 bg-white/5">
              <p className="text-sm">{comment.content}</p>
              <div className="text-xs text-muted-foreground mt-2">
                {new Date(comment.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="glass-button"
          />
          <Button 
            onClick={handleAddComment}
            className="glass-button"
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      </Card>
    </div>
  );
}