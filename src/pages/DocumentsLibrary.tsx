import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ModuleLayout } from "@/components/ModuleLayout";
import { PermissionGuard } from "@/components/PermissionGuard";
import {
  Upload,
  Search,
  FolderOpen,
  FileText,
  File,
  Image,
  Download,
  Share2,
  Trash2,
  MoreVertical,
  ChevronRight,
  Grid3X3,
  List,
  Building2,
  Users,
  Receipt,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image" | "excel" | "word";
  size: string;
  uploadDate: string;
  folder: string;
}

const folders = [
  { id: "company", name: "Company Documents", icon: Building2, count: 5 },
  { id: "payroll", name: "Payroll", icon: Receipt, count: 24 },
  { id: "compliance", name: "Compliance", icon: Shield, count: 12 },
  { id: "employees", name: "Employee Documents", icon: Users, count: 45 },
];

const documents: Document[] = [
  { id: "1", name: "CAC Certificate.pdf", type: "pdf", size: "2.4 MB", uploadDate: "Dec 15, 2025", folder: "company" },
  { id: "2", name: "TIN Certificate.pdf", type: "pdf", size: "1.1 MB", uploadDate: "Dec 10, 2025", folder: "company" },
  { id: "3", name: "December 2025 Payslips.zip", type: "excel", size: "5.2 MB", uploadDate: "Dec 25, 2025", folder: "payroll" },
  { id: "4", name: "PAYE Receipt Dec 2025.pdf", type: "pdf", size: "890 KB", uploadDate: "Jan 8, 2026", folder: "compliance" },
  { id: "5", name: "John Doe Contract.pdf", type: "pdf", size: "1.8 MB", uploadDate: "Nov 20, 2025", folder: "employees" },
  { id: "6", name: "Company Logo.png", type: "image", size: "450 KB", uploadDate: "Oct 5, 2025", folder: "company" },
];

const getFileIcon = (type: Document["type"]) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-8 w-8 text-red-500" />;
    case "image":
      return <Image className="h-8 w-8 text-blue-500" />;
    case "excel":
      return <File className="h-8 w-8 text-green-500" />;
    case "word":
      return <FileText className="h-8 w-8 text-blue-600" />;
    default:
      return <File className="h-8 w-8 text-muted-foreground" />;
  }
};

const DocumentsLibrary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["company"]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
    setSelectedFolder(folderId);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = !selectedFolder || doc.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <ModuleLayout title="Documents" activeTab="documents">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Documents</h1>
            <p className="text-muted-foreground">Organize and manage all your compliance documents</p>
          </div>
          <PermissionGuard permission="documents:upload">
            <Button onClick={() => navigate("/documents/upload")}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search and View Toggle */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          {/* Folders Sidebar */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Folders</h2>
            {folders.map((folder) => {
              const Icon = folder.icon;
              const isExpanded = expandedFolders.includes(folder.id);
              const folderDocs = documents.filter((d) => d.folder === folder.id);

              return (
                <Collapsible key={folder.id} open={isExpanded}>
                  <CollapsibleTrigger asChild>
                    <motion.button
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedFolder === folder.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleFolder(folder.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <FolderOpen className="h-5 w-5 text-primary" />
                        <span className="font-medium">{folder.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {folder.count}
                        </Badge>
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </motion.button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-8 mt-1 space-y-1"
                    >
                      {folderDocs.slice(0, 3).map((doc) => (
                        <button
                          key={doc.id}
                          className="w-full flex items-center gap-2 p-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          onClick={() => navigate(`/documents/${doc.id}`)}
                        >
                          {getFileIcon(doc.type)}
                          <span className="truncate">{doc.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>

          {/* Documents List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                {selectedFolder
                  ? folders.find((f) => f.id === selectedFolder)?.name
                  : "All Documents"}{" "}
                ({filteredDocuments.length})
              </h2>
            </div>

            <AnimatePresence mode="popLayout">
              {viewMode === "list" ? (
                <div className="space-y-2">
                  {filteredDocuments.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/documents/${doc.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        {getFileIcon(doc.type)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.size} • {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredDocuments.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer text-center"
                      onClick={() => navigate(`/documents/${doc.id}`)}
                    >
                      <div className="flex justify-center mb-3">
                        {getFileIcon(doc.type)}
                      </div>
                      <p className="font-medium text-sm truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{doc.size}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Coach Mark */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
          <p className="text-sm text-primary">
            💡 <strong>Tip:</strong> Keep all compliance docs in one place for easy access during audits.
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default DocumentsLibrary;
