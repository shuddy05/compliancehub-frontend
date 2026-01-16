import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  FolderInput,
  ZoomIn,
  ZoomOut,
  RotateCw,
  MoreVertical,
  FileText,
  User,
  Calendar,
  HardDrive,
  Link2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Mock document data
const mockDocument = {
  id: "1",
  name: "CAC Certificate.pdf",
  type: "pdf",
  size: "2.4 MB",
  uploadDate: "Dec 15, 2025",
  uploadedBy: "John Doe",
  relatedTo: "Company",
  folder: "Company Documents",
  previewUrl: "/placeholder.svg",
};

const DocumentViewer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    toast({
      title: "Downloading...",
      description: `${mockDocument.name} will be downloaded shortly.`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Link Copied",
      description: "Document link has been copied to clipboard.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Document Deleted",
      description: "The document has been permanently deleted.",
      variant: "destructive",
    });
    navigate("/documents");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{mockDocument.name}</h1>
              <p className="text-xs text-muted-foreground">{mockDocument.folder}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <FolderInput className="h-4 w-4 mr-2" />
                  Move to Folder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{mockDocument.name}". This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-4 pb-3 border-b border-border">
          <Button variant="ghost" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border" />
          <Button variant="ghost" size="icon" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Document Preview */}
      <main className="flex-1 overflow-auto p-4 bg-muted/50">
        <motion.div
          className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg overflow-hidden"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* PDF/Image Preview Placeholder */}
          <div className="aspect-[8.5/11] bg-card flex items-center justify-center">
            <div className="text-center p-8">
              <FileText className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">{mockDocument.name}</p>
              <p className="text-sm text-muted-foreground mt-2">
                PDF document preview
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Metadata Footer */}
      <footer className="bg-background border-t border-border p-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Uploaded by</p>
              <p className="font-medium">{mockDocument.uploadedBy}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Upload date</p>
              <p className="font-medium">{mockDocument.uploadDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">File size</p>
              <p className="font-medium">{mockDocument.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Related to</p>
              <Button
                variant="link"
                className="h-auto p-0 font-medium"
                onClick={() => navigate("/settings")}
              >
                {mockDocument.relatedTo}
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentViewer;
