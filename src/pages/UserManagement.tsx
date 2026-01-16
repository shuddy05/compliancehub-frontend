import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Users,
  Plus,
  Mail,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Copy,
  Check,
} from "lucide-react";
import { RoleBadge } from "@/components/RoleBadge";

type UserRole = "super_admin" | "company_admin" | "accountant" | "staff" | "support_staff" | "read_only";
type InvitationStatus = "pending" | "accepted" | "expired";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "pending";
  joinedDate?: string;
  invitedDate?: string;
}

interface SupportStaff {
  id: string;
  name: string;
  email: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  status: "active" | "inactive";
  joinedDate: string;
}

interface InviteForm {
  email: string;
  role: UserRole;
}

const roleOptions = [
  {
    value: "company_admin",
    label: "Company Admin",
    description: "Full access to all features and user management",
  },
  {
    value: "accountant",
    label: "Accountant",
    description: "Can manage payroll, compliance, and reports",
  },
  {
    value: "staff",
    label: "Staff",
    description: "Can view payroll and manage basic tasks",
  },
  {
    value: "support_staff",
    label: "Support Staff",
    description: "Can manage and respond to support tickets",
  },
  {
    value: "read_only",
    label: "Read-Only",
    description: "View-only access to all modules",
  },
];

export default function UserManagement() {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      email: "admin@acme.com",
      name: "John Doe",
      role: "company_admin",
      status: "active",
      joinedDate: "2024-01-15",
    },
    {
      id: "2",
      email: "accountant@acme.com",
      name: "Jane Smith",
      role: "accountant",
      status: "active",
      joinedDate: "2024-02-01",
    },
    {
      id: "3",
      email: "staff@acme.com",
      name: "Mike Johnson",
      role: "staff",
      status: "pending",
      invitedDate: "2024-12-20",
    },
  ]);

  const [supportStaff, setSupportStaff] = useState<SupportStaff[]>([
    {
      id: "s1",
      name: "Sarah Williams",
      email: "sarah@support.com",
      ticketsAssigned: 12,
      ticketsResolved: 8,
      status: "active",
      joinedDate: "2024-06-15",
    },
    {
      id: "s2",
      name: "David Chen",
      email: "david@support.com",
      ticketsAssigned: 8,
      ticketsResolved: 6,
      status: "active",
      joinedDate: "2024-08-20",
    },
  ]);

  const [inviteForm, setInviteForm] = useState<InviteForm>({
    email: "",
    role: "staff",
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [supportStaffDialog, setSupportStaffDialog] = useState(false);

  const handleInvite = () => {
    if (!inviteForm.email || !inviteForm.role) return;

    // Generate a mock invitation token
    const invitationToken = Math.random().toString(36).substring(2, 15);
    const invitationLink = `${window.location.origin}/signup?token=${invitationToken}&email=${encodeURIComponent(
      inviteForm.email
    )}`;

    // Add new member to list as pending
    const newMember: TeamMember = {
      id: Date.now().toString(),
      email: inviteForm.email,
      name: inviteForm.email.split("@")[0],
      role: inviteForm.role,
      status: "pending",
      invitedDate: new Date().toLocaleDateString(),
    };

    setTeamMembers([...teamMembers, newMember]);

    // Copy to clipboard (in real app, would send email instead)
    navigator.clipboard.writeText(invitationLink);
    setCopiedId(newMember.id);
    setTimeout(() => setCopiedId(null), 2000);

    // Reset form and close dialog
    setInviteForm({ email: "", role: "staff" });
    setOpenDialog(false);
  };

  const handleRemoveUser = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const handlePromoteToSupportStaff = (member: TeamMember) => {
    // Add to support staff
    const newSupportStaff: SupportStaff = {
      id: `s${member.id}`,
      name: member.name,
      email: member.email,
      ticketsAssigned: 0,
      ticketsResolved: 0,
      status: "active",
      joinedDate: new Date().toLocaleDateString(),
    };
    setSupportStaff([...supportStaff, newSupportStaff]);

    // Update team member role
    setTeamMembers(
      teamMembers.map((m) =>
        m.id === member.id ? { ...m, role: "support_staff" } : m
      )
    );
  };

  const handleRemoveSupportStaff = (id: string) => {
    const staff = supportStaff.find((s) => s.id === id);
    if (!staff) return;

    // Revert role to regular staff
    setTeamMembers(
      teamMembers.map((m) =>
        m.email === staff.email ? { ...m, role: "staff" } : m
      )
    );

    setSupportStaff(supportStaff.filter((s) => s.id !== id));
  };

  const handleCopyInviteLink = (member: TeamMember) => {
    const invitationToken = Math.random().toString(36).substring(2, 15);
    const invitationLink = `${window.location.origin}/signup?token=${invitationToken}&email=${encodeURIComponent(
      member.email
    )}`;
    navigator.clipboard.writeText(invitationLink);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeMembers = teamMembers.filter((m) => m.status === "active");
  const pendingMembers = teamMembers.filter((m) => m.status === "pending");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage your team members and their roles
            </p>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Support Staff Management Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Support Staff</h2>
              <p className="text-sm text-muted-foreground">
                {supportStaff.length} staff member{supportStaff.length !== 1 ? "s" : ""}
              </p>
            </div>

            <Dialog open={supportStaffDialog} onOpenChange={setSupportStaffDialog}>
              <DialogTrigger asChild>
                <Button variant="hero" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Support Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Promote to Support Staff</DialogTitle>
                  <DialogDescription>
                    Select a team member to promote to support staff role. They will be able to manage and respond to support tickets.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Available Team Members</Label>
                    <Select
                      onValueChange={(value) => {
                        const member = teamMembers.find((m) => m.id === value);
                        if (member && member.role !== "support_staff") {
                          handlePromoteToSupportStaff(member);
                          setSupportStaffDialog(false);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a member to promote" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers
                          .filter((m) => m.status === "active" && m.role !== "support_staff")
                          .map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} ({member.email})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {supportStaff.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportStaff.map((staff) => (
                <Card key={staff.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="font-semibold text-primary text-sm">
                              {staff.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold">{staff.name}</p>
                            <p className="text-xs text-muted-foreground mb-2">{staff.email}</p>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                              {staff.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSupportStaff(staff.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                        <div className="text-center">
                          <p className="text-lg font-bold">{staff.ticketsAssigned}</p>
                          <p className="text-xs text-muted-foreground">Tickets Assigned</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{staff.ticketsResolved}</p>
                          <p className="text-xs text-muted-foreground">Resolved</p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Joined {staff.joinedDate}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No support staff yet. Promote a team member to support staff.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Invite Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Team Members</h2>
              <p className="text-sm text-muted-foreground">
                {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
              </p>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button variant="hero" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation link to add a new team member. They'll receive an email with
                    the signup link.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteForm.email}
                      onChange={(e) =>
                        setInviteForm({ ...inviteForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value) =>
                        setInviteForm({ ...inviteForm, role: value as UserRole })
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <RoleBadge role={option.value as UserRole} size="sm" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {roleOptions.find((r) => r.value === inviteForm.role)?.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="hero"
                    onClick={handleInvite}
                    disabled={!inviteForm.email || !inviteForm.role}
                  >
                    Send Invite
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Pending Invitations */}
        {pendingMembers.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Invitations
            </h3>
            <div className="space-y-3">
              {pendingMembers.map((member) => (
                <Card
                  key={member.id}
                  className="hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{member.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Invited {member.invitedDate}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <RoleBadge role={member.role} size="md" showLabel />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyInviteLink(member)}
                          className="gap-2"
                        >
                          {copiedId === member.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy Link
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(member.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Active Members */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Active Members ({activeMembers.length})
          </h3>
          <div className="space-y-3">
            {activeMembers.length > 0 ? (
              activeMembers.map((member) => (
                <Card
                  key={member.id}
                  className="hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-primary">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email} • Joined {member.joinedDate}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <RoleBadge role={member.role} size="md" showLabel />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No active members yet. Invite your first team member.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
