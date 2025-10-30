"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Project {
  id: number;
  name: string;
  bio: string;
}

interface Achievement {
  id: number;
  name: string;
  month: string;
  year: string;
}

interface UserProfile {
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
  skills: string[];
  interests: string[];
  projects: Project[];
  achievements: Achievement[];
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">User not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow">
      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
      <a href={`mailto:${user.email}`}>
      <p className="text-gray-500 mb-4">{user.email}</p>
    </a>
      {user.bio && <p className="mb-4 text-gray-700">{user.bio}</p>}

      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        {user.university && <p><strong>University:</strong> {user.university}</p>}
        {user.course && <p><strong>Course:</strong> {user.course}</p>}
        {user.year && <p><strong>Year:</strong> {user.year}</p>}
        {user.location && <p><strong>Location:</strong> {user.location}</p>}
      </div>

      {user.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {user.interests.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, i) => (
              <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {user.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Projects</h2>
          {user.projects.map((p) => (
            <div key={p.id} className="border p-3 rounded-lg mb-2">
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-gray-600 text-sm">{p.bio}</p>
            </div>
          ))}
        </div>
      )}

      {user.achievements.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-2">Achievements</h2>
          {user.achievements.map((a) => (
            <div key={a.id} className="border p-3 rounded-lg mb-2">
              <p className="font-medium">{a.name}</p>
              <p className="text-gray-500 text-sm">
                {a.month} {a.year}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
