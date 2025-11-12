// src/app/profile/page.tsx
'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
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
// 'User' icon pehle se hai, 'Pencil' add karein
import { User, Plus, Github, ExternalLink, Pencil } from "lucide-react";
// --- Import styles and utils ---
import styles from './profile.module.css';
import { cn } from "@/lib/utils";

// --- Type Definitions (skills/interests ko non-nullable banayein) ---
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
  teamName:string;
  role: string;
  hackathonName:string;
  teamId:string;
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
  // Inhein optional se hata dein, API hamesha array dega (chahe empty)
  skills: string[]; 
  interests: string[];
}
// --- End Type Definitions ---


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

    // === NAYA STATE EDIT DIALOG KE LIYE ===
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        bio: "",
        university: "",
        course: "",
        year: "",
        location: "",
        github: "",
        portfolio: "",
        skills: "", // Comma-separated string ke liye
        interests: "" // Comma-separated string ke liye
    });
    // ======================================

    // --- API Fetching Logic ---
    const fetchUserInfo = async () => {
      setLoadingError(null);
      try {
        // /api/user se logged-in user ka data lein
        const userRes = await axios.get("/api/user");
        let userData: UserInfo = userRes.data;

        // /api/users/[id] se full profile (projects, achievements) lein
        if (userData?.id) {
            try {
                const fullProfileRes = await axios.get(`/api/users/${userData.id}`);
                // Dono responses ko merge karein
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
        const [projectsRes, achievementsRes, teamsRes] = await Promise.all([
          axios.get("/api/projects"),
          axios.get("/api/achievements"),
          axios.get("/api/teams"),
        ]);
        setProjects(projectsRes.data || []);
        setAchievements(achievementsRes.data || []);
        setTeams(teamsRes.data || []);
      } catch (err) {
        console.error("Error fetching related profile data:", err);
        setLoadingError((prev) => (prev ? prev + " Also failed to load projects/achievements." : "Could not load projects and achievements."));
      }
     };
    // --- End API Fetching Logic ---

    useEffect(() => {
      fetchUserInfo();
      fetchRelatedData();
    }, []);

    // === NAYA EFFECT: EDIT FORM KO POPULATE KARNE KE LIYE ===
    useEffect(() => {
        if (userInfo) {
            setEditFormData({
                bio: userInfo.bio || "",
                university: userInfo.university || "",
                course: userInfo.course || "",
                year: userInfo.year || "",
                location: userInfo.location || "",
                github: userInfo.github || "",
                portfolio: userInfo.portfolio || "",
                skills: userInfo.skills?.join(", ") || "",
                interests: userInfo.interests?.join(", ") || ""
            });
        }
    }, [userInfo]);
    // =======================================================

    // --- Add Handlers ---
    const handleAddProject = async (e: React.FormEvent) => {
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

    const handleAddAchievement = async (e: React.FormEvent) => {
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
    
    // === NAYA HANDLER: PROFILE UPDATE KE LIYE ===
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Strings ko arrays mein convert karein API ke liye
            const apiData = {
                ...editFormData,
                skills: editFormData.skills ? editFormData.skills.split(",").map(s => s.trim()).filter(s => s) : [],
                interests: editFormData.interests ? editFormData.interests.split(",").map(i => i.trim()).filter(i => i) : []
            };

            const res = await axios.put("/api/user", apiData);
            
            // Local state ko naye data se update karein
            setUserInfo(res.data); 
            setIsEditDialogOpen(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            // Yahaan error message dikha sakte hain
        }
    };

    // Edit form mein changes ko handle karein
    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };
    // ============================================


    // Helper to format URLs
    const formatUrl = (url: string | null | undefined): string | undefined => {
        if (!url) return undefined;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    }

  // --- JSX Structure ---
  return (
    <div className={styles.pageContainer}>
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
                   <div className={styles.userInfoHeader}>
                        <Avatar className={styles.avatar}>
                            <AvatarFallback>{userInfo.name?.substring(0, 2).toUpperCase() || 'UU'}</AvatarFallback>
                        </Avatar>
                        <div className={styles.userNameEmail}>
                            <h2 className={styles.userName}>{userInfo.name}</h2>
                            <p className={styles.userEmail}>{userInfo.email}</p>
                        </div>
                        
                        {/* === NAYA EDIT BUTTON === */}
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className={cn(styles.editProfileButton, "ml-auto")}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className={styles.dialogContent}>
                                <DialogHeader><DialogTitle>Edit Your Profile</DialogTitle></DialogHeader>
                                <form onSubmit={handleProfileUpdate} className={styles.dialogForm}>
                                    <div className={styles.dialogInputGroup}>
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea id="bio" name="bio" placeholder="Aapke baare mein..." value={editFormData.bio} onChange={handleEditFormChange} />
                                    </div>
                                    <div className={styles.dialogInputGroup}>
                                        <Label htmlFor="university">University</Label>
                                        <Input id="university" name="university" placeholder="University Name" value={editFormData.university} onChange={handleEditFormChange} />
                                    </div>
                                    <div className={styles.dialogInputGroup}>
                                        <Label htmlFor="course">Course</Label>
                                        <Input id="course" name="course" placeholder="e.g., Computer Science" value={editFormData.course} onChange={handleEditFormChange} />
                                    </div>
                                    <div className={styles.dialogInputGroup}>
                                        <Label htmlFor="year">Year</Label>
                                        <Input id="year" name="year" placeholder="e.g., Sophomore" value={editFormData.year} onChange={handleEditFormChange} />
                                    </div>
                                    <div className={styles.dialogInputGroup}>
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" name="location" placeholder="City, Country" value={editFormData.location} onChange={handleEditFormChange} />
                                    </div>
                                    <div className={styles.dialogInputGroup}>
                                        <Label htmlFor="github">GitHub</Label>
                                        <Input id="github" name="github" placeholder="https://github.com/username" value={editFormData.github} onChange={handleEditFormChange} />
                                    </div>
                                    <div className={styles.dialogInputGroup}>
                                        <Label htmlFor="portfolio">Portfolio</Label>
                                        <Input id="portfolio" name="portfolio" placeholder="https://your-website.com" value={editFormData.portfolio} onChange={handleEditFormChange} />
                                    </div>
                                    <div className={styles.dialogInputGroup}>
                                        <Label htmlFor="skills">Skills (comma separated)</Label>
                                        <Input id="skills" name="skills" placeholder="React, Node.js, Figma" value={editFormData.skills} onChange={handleEditFormChange} />
                                    </div>
                                    <div className={styles.dialogInputGroup}>
                                        <Label htmlFor="interests">Interests (comma separated)</Label>
                                        <Input id="interests" name="interests" placeholder="AI, Web Dev, Startups" value={editFormData.interests} onChange={handleEditFormChange} />
                                    </div>
                                    <DialogFooter className={styles.dialogFooter}>
                                        <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                        <Button type="submit">Save Changes</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {/* ======================= */}
                    </div>

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

        {/* --- Sections Grid (Projects, Teams, Achievements) --- */}
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
                </CardHeader>
                <CardContent className={styles.sectionContent}>
                     {teams.length > 0 ? teams.map((t, index) => (
                        <div key={t.teamId || index} className={styles.listItem}>
                            <p className={styles.listItemTitle}>TeamName: {t.teamName}</p>
                            <p className={styles.listItemDescription}>Hackathon: {t.hackathonName}</p>
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