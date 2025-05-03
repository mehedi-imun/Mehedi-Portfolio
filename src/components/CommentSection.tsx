"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Heart } from "lucide-react";
import { toast } from "sonner";

// Type definitions
interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  hasLiked: boolean;
}

interface CommentSectionProps {
  postSlug: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postSlug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  // Load comments from localStorage when the component is mounted
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments-${postSlug}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [postSlug]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments-${postSlug}`, JSON.stringify(comments));
    }
  }, [comments, postSlug]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      author: name,
      content,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      likes: 0,
      hasLiked: false,
    };

    setComments((prevComments) => [newComment, ...prevComments]);
    setContent("");
    toast.success("Comment posted successfully!");
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId && !comment.hasLiked
          ? { ...comment, likes: comment.likes + 1, hasLiked: true }
          : comment
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Comment Form */}
      <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <div className="mt-1 relative">
                <textarea
                  id="comment"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Send size={14} />
                Post Comment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card
              key={comment.id}
              className="overflow-hidden hover:shadow-md transition-all animate-fade-in"
            >
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{comment.author}</h4>
                    <p className="text-sm text-muted-foreground">{comment.date}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1.5 h-8 px-2 ${
                      comment.hasLiked ? "text-red-500" : ""
                    }`}
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={comment.hasLiked}
                  >
                    <Heart
                      size={14}
                      className={comment.hasLiked ? "fill-red-500" : ""}
                    />
                    <span>{comment.likes}</span>
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
