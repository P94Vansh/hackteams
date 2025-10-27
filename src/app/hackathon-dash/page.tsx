
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";


interface Hackathon {
  id: number;
  hackathonName: string;
  hackathonDescription: string;
  problemStatement: string;
  teamSize: number;
  leader?: {
    id: number;
    name: string;
  };
}

export default function HackathonDashboard() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchHackathons() {
      try {
        const res = await fetch("/api/hackathonds");
        if (!res.ok) {
          throw new Error("Failed to fetch hackathons");
        }
        const data = await res.json();
        console.log(data)
        setHackathons(data.hackathons || []);
      } catch (err) {
        console.error("Error fetching hackathons:", err);
        setError("Unable to load hackathons. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchHackathons();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-semibold">
        Loading hackathons...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">{error}</div>
    );
  }

  if (hackathons.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        No hackathons available right now.
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hackathons.map((hackathon) => (
        <div
          key={hackathon.id}
          className="border rounded-xl p-5 shadow-md hover:shadow-lg transition bg-white"
        >
          <h2
            id={`hackathon-title-${hackathon.id}`}
            className="text-xl font-bold text-gray-900 mb-2"
          >
            {hackathon.hackathonName}
          </h2>

          <p className="text-gray-600 mb-3">{hackathon.hackathonDescription}</p>

          <p className="text-gray-800 mb-2">
            <span className="font-semibold">Problem Statement:</span>{" "}
            {hackathon.problemStatement}
          </p>

          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Team Size:</span>{" "}
            {hackathon.teamSize}
          </p>
          {hackathon.leader && (
            <Link href={`/u/${hackathon.leader.id}`}>
            <p className="text-gray-500 text-sm">
              <span className="font-semibold">Leader:</span>{" "}
              {hackathon.leader.name}
            </p>
        
            </Link>
          )}
          <Link 
  href={`/hackathon-join?hackathonId=${hackathon.id}`} 
  className="text-blue-600 hover:underline"
>
  Join  {hackathon.hackathonName}
</Link>

        </div>
        
      ))}
    </div>
  );
}

