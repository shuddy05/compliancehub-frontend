import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleLayout } from "@/components/ModuleLayout";
import {
  Search,
  Play,
  FileText,
  CheckSquare,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  type: "video" | "article" | "checklist";
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  thumbnail: string;
  bookmarked: boolean;
  completed: boolean;
}

const featuredContent: ContentItem[] = [
  {
    id: "1",
    title: "PAYE 101: Understanding Nigerian Tax",
    type: "video",
    category: "Tax Basics",
    difficulty: "Beginner",
    duration: "12 min",
    thumbnail: "/placeholder.svg",
    bookmarked: false,
    completed: false,
  },
  {
    id: "2",
    title: "Setting Up Your First Payroll",
    type: "article",
    category: "Payroll How-Tos",
    difficulty: "Beginner",
    duration: "8 min read",
    thumbnail: "/placeholder.svg",
    bookmarked: true,
    completed: true,
  },
  {
    id: "3",
    title: "Compliance Calendar Explained",
    type: "checklist",
    category: "Compliance Guides",
    difficulty: "Intermediate",
    duration: "5 min",
    thumbnail: "/placeholder.svg",
    bookmarked: false,
    completed: false,
  },
];

const allContent: ContentItem[] = [
  ...featuredContent,
  {
    id: "4",
    title: "Employee Onboarding Best Practices",
    type: "article",
    category: "Payroll How-Tos",
    difficulty: "Beginner",
    duration: "6 min read",
    thumbnail: "/placeholder.svg",
    bookmarked: false,
    completed: false,
  },
  {
    id: "5",
    title: "Understanding Pension Contributions",
    type: "video",
    category: "Tax Basics",
    difficulty: "Intermediate",
    duration: "15 min",
    thumbnail: "/placeholder.svg",
    bookmarked: true,
    completed: false,
  },
  {
    id: "6",
    title: "Filing PAYE Returns Step-by-Step",
    type: "video",
    category: "Compliance Guides",
    difficulty: "Beginner",
    duration: "8 min",
    thumbnail: "/placeholder.svg",
    bookmarked: false,
    completed: true,
  },
  {
    id: "7",
    title: "VAT for Service Companies",
    type: "article",
    category: "Tax Basics",
    difficulty: "Advanced",
    duration: "10 min read",
    thumbnail: "/placeholder.svg",
    bookmarked: false,
    completed: false,
  },
  {
    id: "8",
    title: "Payroll Audit Preparation Checklist",
    type: "checklist",
    category: "Compliance Guides",
    difficulty: "Advanced",
    duration: "15 min",
    thumbnail: "/placeholder.svg",
    bookmarked: false,
    completed: false,
  },
];

const getTypeIcon = (type: ContentItem["type"]) => {
  switch (type) {
    case "video":
      return <Play className="h-4 w-4" />;
    case "article":
      return <FileText className="h-4 w-4" />;
    case "checklist":
      return <CheckSquare className="h-4 w-4" />;
  }
};

const getDifficultyColor = (difficulty: ContentItem["difficulty"]) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "Intermediate":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "Advanced":
      return "bg-red-500/10 text-red-600 border-red-500/20";
  }
};

const LearningHub = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [bookmarks, setBookmarks] = useState<Set<string>>(
    new Set(allContent.filter((c) => c.bookmarked).map((c) => c.id))
  );

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(id)) {
        newBookmarks.delete(id);
      } else {
        newBookmarks.add(id);
      }
      return newBookmarks;
    });
  };

  const filteredContent = allContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && item.category.toLowerCase().includes(activeTab.toLowerCase());
  });

  const completedCount = allContent.filter((c) => c.completed).length;

  return (
    <ModuleLayout title="Learning Hub" activeTab="learn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Learning Hub</h1>
            <p className="text-muted-foreground">Master Nigerian compliance with our curated learning resources</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/learning/progress")}>
            <GraduationCap className="h-4 w-4 mr-2" />
            My Progress
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            onClick={() => navigate("/learning/help-centre")}
            className="w-full justify-start"
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Help Centre
          </Button>
          <Button 
            onClick={() => navigate("/learning/contact-support")}
            className="w-full justify-start"
            variant="outline"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tutorials, articles, guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Your Learning Progress</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {completedCount} of {allContent.length} lessons completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {Math.round((completedCount / allContent.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / allContent.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Featured Content Carousel */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Featured</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {featuredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-72 bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/learning/${item.id}`)}
              >
                <div className="relative h-40 bg-muted">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 gap-1">
                    {getTypeIcon(item.type)}
                    {item.type}
                  </Badge>
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-2">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className={getDifficultyColor(item.difficulty)}>
                      {item.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tax">Tax Basics</TabsTrigger>
            <TabsTrigger value="payroll">Payroll How-Tos</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Guides</TabsTrigger>
            <TabsTrigger value="video">Video Tutorials</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-3">
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg cursor-pointer hover:shadow-md transition-all"
                  onClick={() => navigate(`/learning/${item.id}`)}
                  whileHover={{ y: -2 }}
                >
                  <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.completed && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <CheckSquare className="h-6 w-6 text-green-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs gap-1">
                        {getTypeIcon(item.type)}
                        {item.type}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.duration}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => toggleBookmark(item.id, e)}
                  >
                    {bookmarks.has(item.id) ? (
                      <BookmarkCheck className="h-5 w-5 text-primary" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Coach Mark */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-primary">
            💡 <strong>Tip:</strong> Learn Nigerian compliance basics here to stay ahead of deadlines.
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default LearningHub;
