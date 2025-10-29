// src/app/hackathon-dash/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
// Import Button and useRouter
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'; // Import useRouter
// Import the CSS module
import styles from './hackathon-dash.module.css';

// Interface remains the same
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
  techStack?: string[]; // Optional for now
  rolesNeeded?: string[]; // Optional for now
}

// --- Placeholder Data ---
const placeholderHackathons: Hackathon[] = [
    {
        id: 1,
        hackathonName: "AI Innovation Challenge 2025",
        hackathonDescription: "Develop groundbreaking AI solutions for real-world problems. Focus areas include healthcare, sustainability, and education.",
        problemStatement: "Leverage AI to improve diagnostic accuracy in radiology.",
        teamSize: 4,
        leader: { id: 101, name: "Alice Johnson" },
        techStack: ["Python", "TensorFlow", "React", "AWS"],
        rolesNeeded: ["ML Engineer", "Frontend Dev", "Data Scientist"]
    },
    {
        id: 2,
        hackathonName: "Web3 Builders Hack",
        hackathonDescription: "Create decentralized applications on the blockchain. Explore DeFi, NFTs, and DAOs.",
        problemStatement: "Build a secure and user-friendly decentralized identity system.",
        teamSize: 5,
        leader: { id: 102, name: "Bob Williams" },
        techStack: ["Solidity", "Next.js", "Hardhat", "IPFS"],
        rolesNeeded: ["Smart Contract Dev", "Full Stack Dev", "UI/UX Designer"]
    },
    {
        id: 3,
        hackathonName: "Sustainable Tech Hackathon",
        hackathonDescription: "Code for a greener future. Projects focusing on environmental monitoring, renewable energy, or waste reduction.",
        problemStatement: "", // Example with no problem statement
        teamSize: 3,
        leader: { id: 103, name: "Charlie Brown" },
        techStack: ["IoT", "Node.js", "React Native", "Firebase"],
        rolesNeeded: ["Hardware Specialist", "Mobile Dev", "Backend Dev"]
    },
     {
        id: 4,
        hackathonName: "Open Source Fest",
        hackathonDescription: "Contribute to popular open-source projects or start your own! Collaboration and community focus.",
        problemStatement: "Improve accessibility features in Project X.",
        teamSize: 6,
        leader: { id: 104, name: "Diana Garcia" },
        rolesNeeded: ["Documentation Writer", "Tester", "Frontend Dev", "Backend Dev"]
    }
];
// --- End Placeholder Data ---


export default function HackathonDashboard() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true); // Keep loading state
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize the router

  // --- API Fetching Function (Defined but not called in useEffect) ---
  async function fetchHackathons() {
    // setLoading(true); // Reset loading if called
    // setError(null); // Reset error if called
    try {
      const res = await fetch("/api/hackathonds");
      if (!res.ok) {
        throw new Error("Failed to fetch hackathons");
      }
      const data = await res.json();
      console.log("API Data:", data);
      setHackathons(data.hackathons || []);
    } catch (err: any) {
      console.error("Error fetching hackathons:", err);
      setError(`Unable to load hackathons: ${err.message}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  }
  // --- End API Fetching Function ---


  useEffect(() => {
    // --- Option 1: Use Placeholder Data (Currently Active) ---
    setHackathons(placeholderHackathons);
    setLoading(false); // Set loading to false after setting placeholders
    setError(null); // Clear any previous errors
    // --- End Option 1 ---

    // --- Option 2: Use API Data (Comment out Option 1 and uncomment below) ---
    /*
    fetchHackathons();
    */
    // --- End Option 2 ---

  }, []); // Empty dependency array means this runs once on mount

  // --- Navigation Handler ---
  const handleApplyClick = (hackathonId: number) => {
    router.push(`/hackathon-join?hackathonId=${hackathonId}`);
  };
  // --- End Navigation Handler ---

  // --- Render Logic ---
  if (loading) {
    return (
      <div className={styles.feedbackContainer}>
        Loading hackathons...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.feedbackContainer} ${styles.errorText}`}>
        {error}
      </div>
    );
  }

  if (hackathons.length === 0) {
    return (
      <div className={`${styles.feedbackContainer} ${styles.mutedText}`}>
        No hackathon postings available right now. Check back soon!
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      {hackathons.map((hackathon) => (
        <div key={hackathon.id} className={styles.hackathonCard}>
          {/* Card Title */}
          <h2 className={styles.cardTitle}>
            {hackathon.hackathonName}
          </h2>
          {/* Card Description */}
          <p className={styles.cardDescription}>
            {hackathon.hackathonDescription}
          </p>
          {/* Problem Statement */}
          {hackathon.problemStatement && (
             <p className={styles.cardDetail}>
               <span className={styles.detailLabel}>Problem:</span>{" "}
               {hackathon.problemStatement}
             </p>
          )}
          {/* Team Size */}
          <p className={styles.cardDetail}>
            <span className={styles.detailLabel}>Team Size:</span>{" "}
            {hackathon.teamSize}
          </p>
          {/* Leader Info */}
          {hackathon.leader && (
            <p className={styles.cardLeader}>
              <span className={styles.detailLabel}>Leader:</span>{" "}
              <Link href={`/u/${hackathon.leader.id}`} className={styles.leaderLink}>
                {hackathon.leader.name}
              </Link>
            </p>
           )}
          {/* Tech Stack Display */}
          {hackathon.techStack && hackathon.techStack.length > 0 && (
            <div className={styles.tagsContainer}>
              <span className={styles.detailLabel}>Tech:</span>
              {hackathon.techStack.map(tech => <span key={tech} className={styles.tag}>{tech}</span>)}
            </div>
           )}
          {/* Roles Needed Display */}
          {hackathon.rolesNeeded && hackathon.rolesNeeded.length > 0 && (
             <div className={styles.tagsContainer}>
              <span className={styles.detailLabel}>Roles:</span>
              {hackathon.rolesNeeded.map(role => <span key={role} className={styles.tag}>{role}</span>)}
            </div>
           )}

          {/* Apply Button - Now a standard Button with onClick */}
          <Button
            className={styles.joinButton}
            onClick={() => handleApplyClick(hackathon.id)} // Call handler on click
          >
            Apply to Join Team
          </Button>
        </div>
      ))}
    </div>
  );
}