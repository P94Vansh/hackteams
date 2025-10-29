// src/app/profile/page.tsx
'use client'
import React, { useEffect, useState } from "react";
import axios from "axios"; // Keep axios imported for API calls
// --- Import UI components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
// --- Import Icons ---
import { User, Plus, Github, ExternalLink } from "lucide-react";
// --- Import styles and utils ---
import styles from './profile.module.css';
import { cn } from "@/lib/utils";

// --- Type Definitions (Keep these) ---
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
    active: boolean; // Assuming this exists based on original code
}
interface TeamMember {
  team: Team;
  role: string;
  userId: number; // Assuming this exists based on original code
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
  skills?: string[] | null;
  interests?: string[] | null;
}
// --- End Type Definitions ---

// --- Placeholder Data ---
const placeholderUserInfo: UserInfo = {
  id: 1,
  name: "Aditya Singh",
  email: "aditya.singh@example.com",
  university: "Example University",
  course: "Computer Science",
  year: "Sophomore",
  location: "Patna, India",
  bio: "Aspiring full-stack developer interested in web technologies and hackathons. Always looking to learn and collaborate on exciting projects.",
  github: "github.com/aditya-2441", // Replace with actual if known
  portfolio: "aditya-portfolio.dev", // Replace with actual if known
  skills: ["React", "Next.js", "TypeScript", "Node.js", "Prisma", "Tailwind CSS", "Java"],
  interests: ["Web Development", "AI/ML", "Hackathons", "Open Source", "UI/UX Design"]
};

const placeholderProjects: Project[] = [
  { id: 101, name: "HackTeams Platform", bio: "The very platform for finding hackathon teammates.", skills: ["Next.js", "Prisma", "TypeScript", "PostgreSQL"] },
  { id: 102, name: "AI Study Buddy", bio: "An AI-powered tool to help students summarize notes and generate quizzes.", skills: ["Python", "Flask", "NLP", "React"] },
  { id: 103, name: "Personal Portfolio V2", bio: "Revamped personal website showcasing projects and skills.", skills: ["React", "Tailwind CSS", "Framer Motion"] },
];

const placeholderTeams: TeamMember[] = [
  // Team data is less defined in the API/Schema, making placeholders tricky.
  // Assuming a structure based on original attempt. API needs verification.
  { userId: 1, team: { id: 201, teamName: "Code Wizards", hackathonName: "SIH 2025", active: true }, role: "Frontend Lead" },
  { userId: 1, team: { id: 202, teamName: "Data Dynamos", hackathonName: "Local Hack Day", active: false }, role: "Backend Dev" },
];

const placeholderAchievements: Achievement[] = [
  { id: 301, name: "Won 1st Place - Local Hack Day", month: "October", year: "2024" },
  { id: 302, name: "Published Research Paper on AI Ethics", month: "May", year: "2025" },
  { id: 303, name: "Dean's List - Spring Semester", month: "June", year: "2025" },
];
// --- End Placeholder Data ---


export default function ProfilePage() {
    // State initialization
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

    // --- API Fetching Logic (Keep functions defined but commented out in useEffect) ---
    const fetchUserInfo = async () => {
      setLoadingError(null);
      try {
        const userRes = await axios.get("/api/user");
        let userData: UserInfo = userRes.data;

        if (userData?.id) {
            try {
                const fullProfileRes = await axios.get(`/api/users/${userData.id}`);
                userData = { ...userData, ...fullProfileRes.data.data };
            } catch (profileErr) {
                console.warn("Could not fetch full profile details, using basic info:", profileErr);
            }
        }
        setUserInfo(userData);

      } catch (err) {
        console.error("Error fetching user info:", err);
        setLoadingError("Could not load user information.");
      }
     };

    const fetchRelatedData = async () => {
      try {
        const [projectsRes, achievementsRes] = await Promise.all([
          axios.get("/api/projects"),
          axios.get("/api/achievements"),
          // axios.get("/api/teams"), // Still assuming GET /api/teams might not exist
        ]);
        setProjects(projectsRes.data || []);
        setAchievements(achievementsRes.data || []);
        // setTeams([]);
      } catch (err) {
        console.error("Error fetching related profile data:", err);
        setLoadingError((prev) => (prev ? prev + " Also failed to load projects/achievements." : "Could not load projects and achievements."));
      }
     };
    // --- End API Fetching Logic ---

    useEffect(() => {
      // --- Option 1: Use Placeholder Data (Currently Active) ---
      setUserInfo(placeholderUserInfo);
      setProjects(placeholderProjects);
      setTeams(placeholderTeams);
      setAchievements(placeholderAchievements);
      // --- End Option 1 ---

      // --- Option 2: Use API Data (Comment out Option 1 and uncomment below) ---
      /*
      fetchUserInfo();
      fetchRelatedData();
      */
      // --- End Option 2 ---

    }, []);

    // --- Add Handlers (Using Axios POST) ---
    // These remain unchanged, they will make API calls when invoked
    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const skillsArray = newProject.skills ? newProject.skills.split(",").map(s => s.trim()).filter(s => s) : [];
          const res = await axios.post("/api/projects", {
            ...newProject,
            skills: skillsArray,
          });
          setProjects([...projects, res.data]); // Update state with response
          setNewProject({ name: "", bio: "", skills: "" });
          setIsProjectDialogOpen(false);
        } catch (err) {
          console.error("Error adding project:", err);
          // TODO: Show specific error in UI
        }
      };

    const handleAddTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        console.warn("Attempting to POST to /api/teams - this endpoint may not exist.");
        try {
          const res = await axios.post("/api/teams", newTeam); // Target API endpoint
          console.log("Team add response:", res.data);
          // Refresh data or update state based on actual API response
          // fetchRelatedData(); // Example: Refetch all related data
          setTeams([...teams, res.data]); // Example: Directly add (adjust based on response)
          setNewTeam({ teamName: "", hackathonName: "", role: "" });
          setIsTeamDialogOpen(false);
        } catch (err) {
          console.error("Error adding team:", err);
           // TODO: Show specific error in UI
        }
      };

    const handleAddAchievement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const res = await axios.post("/api/achievements", newAchievement);
          setAchievements([...achievements, res.data]); // Update state with response
          setNewAchievement({ name: "", month: "", year: "" });
          setIsAchievementDialogOpen(false);
        } catch (err) {
          console.error("Error adding achievement:", err);
           // TODO: Show specific error in UI
        }
      };
    // --- End Add Handlers ---


    // Helper to format URLs
    const formatUrl = (url: string | null | undefined): string | undefined => {
        if (!url) return undefined;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    }

  // --- JSX Structure ---
  return (
    <div className={styles.pageContainer}>
      {/* Page Title Removed */}

      {loadingError && (
          <Card className={styles.errorCard}>
              <CardContent className={styles.errorCardContent}>
                  {loadingError}
              </CardContent>
          </Card>
      )}

      {/* --- User Info Section --- */}
      {userInfo ? (
            <Card className={styles.card}>
               <CardContent className={styles.userInfoContent}>
                   {/* Avatar and Name/Email */}
                   <div className={styles.userInfoHeader}>
                        <Avatar className={styles.avatar}>
                            <AvatarFallback>{userInfo.name?.substring(0, 2).toUpperCase() || 'UU'}</AvatarFallback>
                        </Avatar>
                        <div className={styles.userNameEmail}>
                            <h2 className={styles.userName}>{userInfo.name}</h2>
                            <p className={styles.userEmail}>{userInfo.email}</p>
                        </div>
                    </div>
                    {/* Bio, Details, Links, Skills, Interests */}
                     {userInfo.bio && <p className={styles.userBio}>{userInfo.bio}</p>}
                     <div className={styles.userDetailsGrid}>
                        {userInfo.university && <div className={styles.detailItem}><span className={styles.detailLabel}>University:</span> {userInfo.university}</div>}
                        {userInfo.course && <div className={styles.detailItem}><span className={styles.detailLabel}>Course:</span> {userInfo.course}</div>}
                        {userInfo.year && <div className={styles.detailItem}><span className={styles.detailLabel}>Year:</span> {userInfo.year}</div>}
                        {userInfo.location && <div className={styles.detailItem}><span className={styles.detailLabel}>Location:</span> {userInfo.location}</div>}
                    </div>
                    <div className={styles.userLinks}>
                        {userInfo.github && (
                            <a href={formatUrl(userInfo.github)} target="_blank" rel="noopener noreferrer" className={styles.userLink}>
                                <Github className={styles.userLinkIcon} /> GitHub
                            </a>
                        )}
                        {userInfo.portfolio && (
                             <a href={formatUrl(userInfo.portfolio)} target="_blank" rel="noopener noreferrer" className={styles.userLink}>
                                <ExternalLink className={styles.userLinkIcon} /> Portfolio
                            </a>
                        )}
                    </div>
                     {(userInfo.skills && userInfo.skills.length > 0) && (
                         <div className={styles.tagsSection}>
                            <h4 className={styles.tagsHeader}>Skills</h4>
                            <div className={styles.tagsContainer}>
                                {userInfo.skills.map((skill, i) => <span key={`skill-${i}`} className={cn(styles.tag, styles.skillTag)}>{skill}</span>)}
                            </div>
                        </div>
                    )}
                     {(userInfo.interests && userInfo.interests.length > 0) && (
                         <div className={styles.tagsSection}>
                            <h4 className={styles.tagsHeader}>Interests</h4>
                            <div className={styles.tagsContainer}>
                                {userInfo.interests.map((interest, i) => <span key={`interest-${i}`} className={cn(styles.tag, styles.interestTag)}>{interest}</span>)}
                            </div>
                        </div>
                    )}
               </CardContent>
            </Card>
        ) : (
            !loadingError && <p className={styles.loadingText}>Loading user info...</p>
        )}

        {/* --- Sections Grid --- */}
        <div className={styles.sectionsGrid}>
            {/* Projects Section */}
            <Card className={styles.card}>
                <CardHeader className={styles.sectionHeader}>
                    <CardTitle className={styles.sectionTitle}>Projects</CardTitle>
                    <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className={styles.addButton}>
                                <Plus className={styles.addIcon} /> Add
                            </Button>
                        </DialogTrigger>
                        <DialogContent className={styles.dialogContent}>
                            <DialogHeader><DialogTitle>Add New Project</DialogTitle></DialogHeader>
                            <form onSubmit={handleAddProject} className={styles.dialogForm}>
                                <div className={styles.dialogInputGroup}>
                                    <Label htmlFor="projectName">Project Name</Label>
                                    <Input id="projectName" placeholder="Awesome Project" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} required />
                                </div>
                                <div className={styles.dialogInputGroup}>
                                    <Label htmlFor="projectBio">Short Description</Label>
                                    <Textarea id="projectBio" placeholder="What the project is about..." value={newProject.bio} onChange={(e) => setNewProject({ ...newProject, bio: e.target.value })} required />
                                </div>
                                <div className={styles.dialogInputGroup}>
                                    <Label htmlFor="projectSkills">Skills (comma separated)</Label>
                                    <Input id="projectSkills" placeholder="React, Node.js, Prisma" value={newProject.skills} onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })} />
                                </div>
                                <DialogFooter className={styles.dialogFooter}>
                                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                    <Button type="submit">Save Project</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className={styles.sectionContent}>
                    {projects.length > 0 ? projects.map(p => (
                        <div key={p.id} className={styles.listItem}>
                            <h3 className={styles.listItemTitle}>{p.name}</h3>
                            <p className={styles.listItemDescription}>{p.bio}</p>
                            {p.skills && p.skills.length > 0 && (
                                <p className={styles.listItemSkills}>
                                    <span className={styles.listItemSkillsLabel}>Skills:</span> {p.skills.join(", ")}
                                </p>
                            )}
                        </div>
                    )) : (
                        <p className={styles.emptyListText}>No projects added yet.</p>
                    )}
                </CardContent>
            </Card>

             {/* Teams Section */}
            <Card className={styles.card}>
                <CardHeader className={styles.sectionHeader}>
                    <CardTitle className={styles.sectionTitle}>Teams</CardTitle>
                    <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className={styles.addButton}>
                                <Plus className={styles.addIcon} /> Add
                            </Button>
                        </DialogTrigger>
                        <DialogContent className={styles.dialogContent}>
                            <DialogHeader><DialogTitle>Add New Team</DialogTitle></DialogHeader>
                            <form onSubmit={handleAddTeam} className={styles.dialogForm}>
                                <div className={styles.dialogInputGroup}>
                                    <Label htmlFor="teamName">Team Name</Label>
                                    <Input id="teamName" placeholder="Team Alpha" value={newTeam.teamName} onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })} required />
                                </div>
                                <div className={styles.dialogInputGroup}>
                                    <Label htmlFor="hackathonName">Hackathon Name</Label>
                                    <Input id="hackathonName" placeholder="e.g., SIH 2024" value={newTeam.hackathonName} onChange={(e) => setNewTeam({ ...newTeam, hackathonName: e.target.value })} required />
                                </div>
                                <div className={styles.dialogInputGroup}>
                                    <Label htmlFor="teamRole">Your Role</Label>
                                    <Input id="teamRole" placeholder="e.g., Frontend Developer" value={newTeam.role} onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })} required/>
                                </div>
                                <DialogFooter className={styles.dialogFooter}>
                                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                    <Button type="submit">Save Team</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className={styles.sectionContent}>
                     {teams.length > 0 ? teams.map((t, index) => (
                        <div key={t.team.id || index} className={styles.listItem}>
                            <h3 className={styles.listItemTitle}>{t.team.teamName}</h3>
                            <p className={styles.listItemDescription}>Hackathon: {t.team.hackathonName}</p>
                            <p className={styles.listItemDescription}>Role: {t.role}</p>
                        </div>
                    )) : (
                        <p className={styles.emptyListText}>No teams joined or created yet.</p>
                    )}
                </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card className={styles.card}>
                 <CardHeader className={styles.sectionHeader}>
                      <CardTitle className={styles.sectionTitle}>Achievements</CardTitle>
                      <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
                         <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className={styles.addButton}>
                                <Plus className={styles.addIcon} /> Add
                            </Button>
                         </DialogTrigger>
                         <DialogContent className={styles.dialogContent}>
                             <DialogHeader><DialogTitle>Add New Achievement</DialogTitle></DialogHeader>
                             <form onSubmit={handleAddAchievement} className={styles.dialogForm}>
                                <div className={styles.dialogInputGroup}>
                                    <Label htmlFor="achievementName">Achievement</Label>
                                    <Input id="achievementName" placeholder="e.g., Won SIH 2024" value={newAchievement.name} onChange={(e) => setNewAchievement({ ...newAchievement, name: e.target.value })} required />
                                </div>
                                <div className={styles.dialogInputGroup}>
                                    <Label htmlFor="achievementMonth">Month</Label>
                                    <Input id="achievementMonth" placeholder="e.g., March" value={newAchievement.month} onChange={(e) => setNewAchievement({ ...newAchievement, month: e.target.value })} required />
                                </div>
                                <div className={styles.dialogInputGroup}>
                                    <Label htmlFor="achievementYear">Year</Label>
                                    <Input id="achievementYear" placeholder="e.g., 2024" value={newAchievement.year} onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })} required />
                                </div>
                                <DialogFooter className={styles.dialogFooter}>
                                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                    <Button type="submit">Save Achievement</Button>
                                </DialogFooter>
                             </form>
                         </DialogContent>
                     </Dialog>
                 </CardHeader>
                 <CardContent className={styles.sectionContent}>
                    {achievements.length > 0 ? achievements.map(a => (
                        <div key={a.id} className={styles.listItem}>
                            <h3 className={styles.listItemTitle}>{a.name}</h3>
                            <p className={styles.listItemDescription}>
                                {a.month} {a.year}
                            </p>
                        </div>
                    )) : (
                        <p className={styles.emptyListText}>No achievements added yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}