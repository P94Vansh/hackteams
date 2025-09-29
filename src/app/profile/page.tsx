'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Plus } from "lucide-react";

interface Project {
  id: number;
  name: string;
  bio: string;
  skills: string[];
}

interface TeamMember {
  team: {
    id: number;
    teamName: string;
    hackathonName: string;
    active: boolean;
  };
  role: string;
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
  university?: string;
  course?: string;
  year?: string;
  location?: string;
  bio?: string;
  github?: string;
  portfolio?: string;
}




export default function ProfilePage() {
    
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const fetchUserInfo = async () => {
  try {
    const res = await axios.get("/api/user");
    setUserInfo(res.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchUserInfo();
  fetchData(); // your projects, teams, achievements
}, []);

  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [newProject, setNewProject] = useState({ name: "", bio: "", skills: "" });
  const [newTeam, setNewTeam] = useState({ teamName: "", hackathonName: "", role: "" });
  const [newAchievement, setNewAchievement] = useState({ name: "", month: "", year: "" });

  const fetchData = async () => {
    try {
      const [projectsRes, teamsRes, achievementsRes] = await Promise.all([
        axios.get("/api/projects"),
        axios.get("/api/teams"),
        axios.get("/api/achievements"),
      ]);

      setProjects(projectsRes.data);
      setTeams(teamsRes.data);
      setAchievements(achievementsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProject = async () => {
    try {
      const res = await axios.post("/api/projects", {
        ...newProject,
        skills: newProject.skills.split(",").map(s => s.trim()),
      });
      setProjects([...projects, res.data]);
      setNewProject({ name: "", bio: "", skills: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTeam = async () => {
    try {
      const res = await axios.post("/api/teams", newTeam);
      setTeams([...teams, res.data.members[0]]);
      setNewTeam({ teamName: "", hackathonName: "", role: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAchievement = async () => {
    try {
      const res = await axios.post("/api/achievements", newAchievement);
      setAchievements([...achievements, res.data]);
      setNewAchievement({ name: "", month: "", year: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        Your Profile
      </h1>
        {userInfo && (
  <Card className="mb-6 p-4 flex flex-col space-y-2">
    <div className="flex items-center space-x-4">
      <User className="w-10 h-10 text-primary-foreground" />
      <div>
        <h2 className="text-xl font-bold">{userInfo.name}</h2>
        <p className="text-muted-foreground">{userInfo.email}</p>
      </div>
    </div>
    {userInfo.university && <p>University: {userInfo.university}</p>}
    {userInfo.course && <p>Course: {userInfo.course}</p>}
    {userInfo.year && <p>Year: {userInfo.year}</p>}
    {userInfo.location && <p>Location: {userInfo.location}</p>}
    {userInfo.bio && <p>Bio: {userInfo.bio}</p>}
    {userInfo.github && <p>GitHub: {userInfo.github}</p>}
    {userInfo.portfolio && <p>Portfolio: {userInfo.portfolio}</p>}
  </Card>
)}

      {/* Projects Section */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Projects</CardTitle>
          <Button size="sm" onClick={handleAddProject}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="p-2 border rounded">
              <h2 className="font-semibold">{p.name}</h2>
              <p>{p.bio}</p>
              <p className="text-sm text-muted-foreground">Skills: {p.skills.join(", ")}</p>
            </div>
          ))}

          {/* Add Project Form */}
          <div className="space-y-2 mt-4">
            <Input
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <Input
              placeholder="Bio"
              value={newProject.bio}
              onChange={(e) => setNewProject({ ...newProject, bio: e.target.value })}
            />
            <Input
              placeholder="Skills (comma separated)"
              value={newProject.skills}
              onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Teams Section */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Teams</CardTitle>
          <Button size="sm" onClick={handleAddTeam}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {teams.map(t => (
            <div key={t.team.id} className="p-2 border rounded">
              <h2 className="font-semibold">{t.team.teamName}</h2>
              <p>Hackathon: {t.team.hackathonName}</p>
              <p>Role: {t.role}</p>
              <p>Status: {t.team.active ? "Active" : "Inactive"}</p>
            </div>
          ))}

          {/* Add Team Form */}
          <div className="space-y-2 mt-4">
            <Input
              placeholder="Team Name"
              value={newTeam.teamName}
              onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}
            />
            <Input
              placeholder="Hackathon Name"
              value={newTeam.hackathonName}
              onChange={(e) => setNewTeam({ ...newTeam, hackathonName: e.target.value })}
            />
            <Input
              placeholder="Role (Frontend/Backend)"
              value={newTeam.role}
              onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Achievements</CardTitle>
          <Button size="sm" onClick={handleAddAchievement}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map(a => (
            <div key={a.id} className="p-2 border rounded">
              <h2 className="font-semibold">{a.name}</h2>
              <p>
                {a.month} {a.year}
              </p>
            </div>
          ))}

          {/* Add Achievement Form */}
          <div className="space-y-2 mt-4">
            <Input
              placeholder="Achievement Name"
              value={newAchievement.name}
              onChange={(e) => setNewAchievement({ ...newAchievement, name: e.target.value })}
            />
            <Input
              placeholder="Month"
              value={newAchievement.month}
              onChange={(e) => setNewAchievement({ ...newAchievement, month: e.target.value })}
            />
            <Input
              placeholder="Year"
              value={newAchievement.year}
              onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
