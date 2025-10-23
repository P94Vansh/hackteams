// src/app/profile/page.tsx
'use client'
import React, { useEffect, useState } from "react"; // Import React
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"; // Ensure this is added via shadcn/ui
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"; // Ensure this is added via shadcn/ui
import { Label } from "@/components/ui/label";

// --- Type Definitions ---
interface Project {
  id: number;
  name: string;
  bio: string;
  skills: string[];
}
interface Team {
    id: number;
    teamName: string;
    hackathonName: string;
    active: boolean;
}
interface TeamMember {
  team: Team;
  role: string;
  userId: number;
}
interface Achievement {
  id: number;
  name: string;
  month: string;
  year: string;
}
interface UserInfo {
  id: number;
  name: string;
  email: string;
  university?: string | null;
  course?: string | null;
  year?: string | null;
  location?: string | null;
  bio?: string | null;
  github?: string | null;
  portfolio?: string | null;
}
// --- End Type Definitions ---

export default function ProfilePage() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [teams, setTeams] = useState<TeamMember[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [newProject, setNewProject] = useState({ name: "", bio: "", skills: "" });
    const [newTeam, setNewTeam] = useState({ teamName: "", hackathonName: "", role: "" });
    const [newAchievement, setNewAchievement] = useState({ name: "", month: "", year: "" });
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
    const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);

    const fetchUserInfo = async () => { /* ... (fetch user info code remains the same) ... */
      try {
        const res = await axios.get("/api/user");
        setUserInfo(res.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setLoadingError("Could not load user information.");
      }
     };
    const fetchData = async () => { /* ... (fetch profile data code remains the same) ... */
      setLoadingError(null);
      try {
        const requests = [
          axios.get("/api/projects"),
          // axios.get("/api/teams"), // Still assuming this GET might not exist
          axios.get("/api/achievements"),
        ];
        // Only include teams if the endpoint exists
        const teamsEndpointExists = false; // Adjust if GET /api/teams exists
        if (teamsEndpointExists) {
             console.warn("Fetching /api/teams - ensure this GET endpoint exists and returns TeamMember[] structure.");
             // requests.splice(1, 0, axios.get("/api/teams")); // Uncomment if needed
        }
        const responses = await Promise.all(requests);
        setProjects(responses[0].data);
        // setTeams(teamsEndpointExists ? responses[1].data : []); // Adjust index if needed
        setAchievements(teamsEndpointExists ? responses[1].data : responses[1].data); // Adjusted index
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setLoadingError("Could not load profile details (projects, teams, achievements).");
      }
     };

    useEffect(() => {
      fetchUserInfo();
      fetchData();
    }, []);

    // --- Add Handlers with type hint for 'e' ---
    const handleAddProject = async (e: React.FormEvent) => { // Added type React.FormEvent
        e.preventDefault();
        try {
          const skillsArray = newProject.skills ? newProject.skills.split(",").map(s => s.trim()).filter(s => s) : [];
          const res = await axios.post("/api/projects", {
            ...newProject,
            skills: skillsArray,
          });
          setProjects([...projects, res.data]);
          setNewProject({ name: "", bio: "", skills: "" });
          setIsProjectDialogOpen(false);
        } catch (err) {
          console.error("Error adding project:", err);
        }
      };

    const handleAddTeam = async (e: React.FormEvent) => { // Added type React.FormEvent
        e.preventDefault();
        try {
          const res = await axios.post("/api/teams", newTeam);
          if (res.data && res.data.userId && res.data.team) {
              setTeams(prevTeams => [...prevTeams, res.data]);
          } else {
              console.warn("Received unexpected response structure from POST /api/teams. Please adjust state update.", res.data);
              fetchData(); // Refetch as fallback
          }
          setNewTeam({ teamName: "", hackathonName: "", role: "" });
          setIsTeamDialogOpen(false);
        } catch (err) {
          console.error("Error adding team:", err);
        }
      };

    const handleAddAchievement = async (e: React.FormEvent) => { // Added type React.FormEvent
        e.preventDefault();
        try {
          const res = await axios.post("/api/achievements", newAchievement);
          setAchievements([...achievements, res.data]);
          setNewAchievement({ name: "", month: "", year: "" });
          setIsAchievementDialogOpen(false);
        } catch (err) {
          console.error("Error adding achievement:", err);
        }
      };

    // Helper to format URLs
    const formatUrl = (url: string | null | undefined): string | undefined => {
        if (!url) return undefined;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        Your Profile
      </h1>

      {loadingError && ( /* ... (error display remains the same) ... */
          <Card className="mb-8 bg-destructive/10 border-destructive/30">
              <CardContent className="p-4 text-center text-destructive font-medium">
                  {loadingError}
              </CardContent>
          </Card>
      )}

        {userInfo ? ( /* ... (User Info Card remains the same) ... */
            <Card className="mb-8 overflow-hidden">
                <CardContent className="p-6 flex flex-col md:flex-row items-start gap-6">
                    <div className="flex items-center space-x-4 flex-shrink-0">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback>{userInfo.name?.substring(0, 2).toUpperCase() || 'UU'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                            <p className="text-muted-foreground">{userInfo.email}</p>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mt-4 md:mt-0">
                        {userInfo.university && <div><span className="font-semibold text-muted-foreground mr-1">University:</span> {userInfo.university}</div>}
                        {userInfo.course && <div><span className="font-semibold text-muted-foreground mr-1">Course:</span> {userInfo.course}</div>}
                        {userInfo.year && <div><span className="font-semibold text-muted-foreground mr-1">Year:</span> {userInfo.year}</div>}
                        {userInfo.location && <div><span className="font-semibold text-muted-foreground mr-1">Location:</span> {userInfo.location}</div>}
                        {userInfo.github && <div className="sm:col-span-2"><span className="font-semibold text-muted-foreground mr-1">GitHub:</span> <a href={formatUrl(userInfo.github)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{userInfo.github}</a></div>}
                        {userInfo.portfolio && <div className="sm:col-span-2"><span className="font-semibold text-muted-foreground mr-1">Portfolio:</span> <a href={formatUrl(userInfo.portfolio)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{userInfo.portfolio}</a></div>}
                        {userInfo.bio && (
                            <div className="sm:col-span-2 mt-2">
                                <p className="text-muted-foreground leading-relaxed italic">{userInfo.bio}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        ) : (
            !loadingError && <p className="text-muted-foreground mb-8">Loading user info...</p>
        )}

      {/* --- Sections using Dialog for Adding Items --- */}

      {/* Projects Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Projects</CardTitle>
          <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader><DialogTitle>Add New Project</DialogTitle></DialogHeader>
              <form onSubmit={handleAddProject} className="space-y-4 pt-4">
                  <div className="space-y-1">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input id="projectName" placeholder="Awesome Project" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="projectBio">Short Description</Label>
                    <Textarea id="projectBio" placeholder="What the project is about..." value={newProject.bio} onChange={(e) => setNewProject({ ...newProject, bio: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                     <Label htmlFor="projectSkills">Skills (comma separated)</Label>
                    <Input id="projectSkills" placeholder="React, Node.js, Prisma" value={newProject.skills} onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })} />
                  </div>
                  <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit">Save Project</Button>
                  </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
            {/* ... (Projects list display remains the same) ... */}
            {projects.length > 0 ? projects.map(p => (
                <div key={p.id} className="p-4 border rounded-md bg-card shadow-sm">
                <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{p.bio}</p>
                {p.skills && p.skills.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Skills:</span> {p.skills.join(", ")}
                    </p>
                )}
                </div>
            )) : (
                <p className="text-sm text-muted-foreground italic text-center py-4">No projects added yet.</p>
            )}
        </CardContent>
      </Card>

      {/* Teams Section */}
      <Card className="mb-6">
          <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Teams</CardTitle>
              <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                  {/* ... (DialogTrigger for Add Team remains the same) ... */}
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex items-center">
                        <Plus className="w-4 h-4 mr-1" /> Add Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                      <DialogHeader><DialogTitle>Add New Team</DialogTitle></DialogHeader>
                      <form onSubmit={handleAddTeam} className="space-y-4 pt-4">
                          {/* ... (Team form inputs remain the same) ... */}
                          <div className="space-y-1">
                             <Label htmlFor="teamName">Team Name</Label>
                             <Input id="teamName" placeholder="Team Alpha" value={newTeam.teamName} onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })} required />
                          </div>
                           <div className="space-y-1">
                              <Label htmlFor="hackathonName">Hackathon Name</Label>
                             <Input id="hackathonName" placeholder="e.g., SIH 2024" value={newTeam.hackathonName} onChange={(e) => setNewTeam({ ...newTeam, hackathonName: e.target.value })} required />
                           </div>
                            <div className="space-y-1">
                               <Label htmlFor="teamRole">Your Role</Label>
                              <Input id="teamRole" placeholder="e.g., Frontend Developer" value={newTeam.role} onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })} required/>
                            </div>
                          <DialogFooter>
                              <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                              <Button type="submit">Save Team</Button>
                          </DialogFooter>
                      </form>
                  </DialogContent>
              </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
              {/* ... (Teams list display remains the same) ... */}
              {teams.length > 0 ? teams.map((t, index) => (
                 <div key={t.team.id || index} className="p-4 border rounded-md bg-card shadow-sm">
                   <h3 className="font-semibold text-lg mb-1">{t.team.teamName}</h3>
                   <p className="text-sm text-muted-foreground">Hackathon: {t.team.hackathonName}</p>
                   <p className="text-sm text-muted-foreground">Role: {t.role}</p>
                   <p className="text-sm text-muted-foreground">Status: {t.team.active ? "Active" : "Inactive"}</p>
                 </div>
               )) : (
                  <p className="text-sm text-muted-foreground italic text-center py-4">No teams joined or created yet.</p>
               )}
          </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Achievements</CardTitle>
           <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
            {/* ... (DialogTrigger for Add Achievement remains the same) ... */}
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Add Achievement
                </Button>
                </DialogTrigger>
             <DialogContent className="bg-white">
                <DialogHeader><DialogTitle>Add New Achievement</DialogTitle></DialogHeader>
                <form onSubmit={handleAddAchievement} className="space-y-4 pt-4">
                    {/* ... (Achievement form inputs remain the same) ... */}
                    <div className="space-y-1">
                         <Label htmlFor="achievementName">Achievement</Label>
                         <Input id="achievementName" placeholder="e.g., Won SIH 2024" value={newAchievement.name} onChange={(e) => setNewAchievement({ ...newAchievement, name: e.target.value })} required />
                     </div>
                      <div className="space-y-1">
                         <Label htmlFor="achievementMonth">Month</Label>
                         <Input id="achievementMonth" placeholder="e.g., March" value={newAchievement.month} onChange={(e) => setNewAchievement({ ...newAchievement, month: e.target.value })} required />
                      </div>
                     <div className="space-y-1">
                         <Label htmlFor="achievementYear">Year</Label>
                         <Input id="achievementYear" placeholder="e.g., 2024" value={newAchievement.year} onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })} required />
                     </div>
                   <DialogFooter>
                       <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                       <Button type="submit">Save Achievement</Button>
                   </DialogFooter>
                </form>
             </DialogContent>
           </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
            {/* ... (Achievements list display remains the same) ... */}
            {achievements.length > 0 ? achievements.map(a => (
                <div key={a.id} className="p-4 border rounded-md bg-card shadow-sm">
                <h3 className="font-semibold text-lg mb-1">{a.name}</h3>
                <p className="text-sm text-muted-foreground">
                    {a.month} {a.year}
                </p>
                </div>
            )) : (
                <p className="text-sm text-muted-foreground italic text-center py-4">No achievements added yet.</p>
            )}
        </CardContent>
      </Card>

    </div>
  );
}