import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Play,
  Pause,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  Bookmark,
  Share2,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

// Mock content data
const mockContent = {
  id: "1",
  title: "PAYE 101: Understanding Nigerian Tax",
  type: "video" as const,
  category: "Tax Basics",
  difficulty: "Beginner" as const,
  duration: "12 min",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  description: `
    Learn the fundamentals of Pay-As-You-Earn (PAYE) tax in Nigeria. This comprehensive guide covers:
    
    • What is PAYE and who needs to pay it
    • How to calculate PAYE using the graduated tax table
    • Monthly filing deadlines and requirements
    • Common mistakes and how to avoid them
    • How ComplianceHub automates PAYE calculations for you
  `,
  relatedContent: [
    { id: "2", title: "Setting Up Your First Payroll", type: "article", duration: "8 min read" },
    { id: "5", title: "Understanding Pension Contributions", type: "video", duration: "15 min" },
  ],
};

const ContentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  // Simulate progress tracking
  useState(() => {
    if (mockContent.type === "video") {
      const interval = setInterval(() => {
        if (isPlaying && progress < 100) {
          setProgress((prev) => Math.min(prev + 1, 100));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  });

  const handleComplete = () => {
    setIsCompleted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    toast({
      title: "🎉 Lesson Completed!",
      description: "Great job! You've completed this lesson.",
    });
  };

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    toast({
      title: "Thanks for your feedback!",
      description: "This helps us improve our content.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold truncate">{mockContent.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Video/Content Player */}
        {mockContent.type === "video" ? (
          <div className="relative aspect-video bg-black">
            <iframe
              src={mockContent.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Custom Play Overlay (would be used for custom player) */}
            {!isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                <motion.div
                  className="h-20 w-20 rounded-full bg-primary flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-8 w-8 text-primary-foreground ml-1" />
                </motion.div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            {/* Article content would go here */}
          </div>
        )}

        {/* Progress Bar */}
        <div className="px-4 py-2 bg-muted/50">
          <Progress value={progress} className="h-1" />
        </div>

        <div className="p-4 space-y-6">
          {/* Meta Info */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge>{mockContent.category}</Badge>
            <Badge variant="outline">{mockContent.difficulty}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {mockContent.duration}
            </span>
            {isCompleted && (
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none">
            <h2 className="text-lg font-semibold">About this lesson</h2>
            <div className="whitespace-pre-line text-muted-foreground">
              {mockContent.description}
            </div>
          </div>

          {/* Mark as Complete */}
          {!isCompleted && (
            <Button className="w-full" size="lg" onClick={handleComplete}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Complete
            </Button>
          )}

          {/* Feedback */}
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm font-medium mb-3">Was this helpful?</p>
            <div className="flex items-center gap-3">
              <Button
                variant={feedback === "up" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeedback("up")}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Yes
              </Button>
              <Button
                variant={feedback === "down" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeedback("down")}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                No
              </Button>
            </div>
          </div>

          {/* Related Content */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Related Content</h2>
            <div className="space-y-3">
              {mockContent.relatedContent.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg cursor-pointer"
                  onClick={() => navigate(`/learning/${item.id}`)}
                  whileHover={{ x: 4 }}
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type} • {item.duration}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ContentDetail;
