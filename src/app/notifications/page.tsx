// src/app/notifications/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios"; // Keep axios imported for API calls
import styles from './notifications.module.css';
import { cn } from "@/lib/utils";

// Interface remains the same
interface Applicant {
  id: number;
  applicant: {
    name: string;
    email: string;
  };
  applicantSkills: string[];
  status: string; // 'pending', 'accepted', 'rejected'
  hackathon: {
    hackathonName: string;
  };
}

// --- Placeholder Data ---
const placeholderApplications: Applicant[] = [
    {
        id: 101,
        applicant: { name: "Charlie Davis", email: "charlie.d@example.edu" },
        applicantSkills: ["React", "Node.js", "MongoDB"],
        status: "pending",
        hackathon: { hackathonName: "AI Innovation Challenge 2025" }
    },
    {
        id: 102,
        applicant: { name: "Eva Martinez", email: "eva.m@example.org" },
        applicantSkills: ["Python", "Data Analysis", "SQL", "Tableau"],
        status: "pending",
        hackathon: { hackathonName: "AI Innovation Challenge 2025" }
    },
    {
        id: 103,
        applicant: { name: "Frank Green", email: "frank.g@sample.net" },
        applicantSkills: ["Solidity", "Hardhat", "Web3.js"],
        status: "accepted",
        hackathon: { hackathonName: "Web3 Builders Hack" }
    },
    {
        id: 104,
        applicant: { name: "Grace Hall", email: "grace.h@mail.dev" },
        applicantSkills: ["UI/UX Design", "Figma", "User Research"],
        status: "rejected",
        hackathon: { hackathonName: "Sustainable Tech Hackathon" }
    }
];
// --- End Placeholder Data ---


export default function ApplicantsPage() {
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true); // Still use loading state briefly
  const [error, setError] = useState<string | null>(null);

  // --- API Fetching Function (Defined but not called in useEffect) ---
  const fetchApplications = async () => {
    // setLoading(true); // Reset loading if called
    // setError(null); // Reset error on fetch
    try {
      const res = await axios.get("/api/status"); // API endpoint
      setApplications(res.data.data || []); // Ensure it defaults to an empty array
    } catch (err: any) { // Type error
      console.error("Error fetching applications:", err);
      setError(`Failed to load applications: ${err.response?.data?.error || err.message}`); // Set error message
    } finally {
      setLoading(false);
    }
  };
  // --- End API Fetching Function ---


  useEffect(() => {
    // --- Option 1: Use Placeholder Data (Currently Active) ---
    setApplications(placeholderApplications);
    setLoading(false); // Set loading false after setting placeholders
    setError(null); // Clear errors
    // --- End Option 1 ---

    // --- Option 2: Use API Data (Comment out Option 1 and uncomment below) ---
    /*
    fetchApplications();
    */
    // --- End Option 2 ---

  }, []); // Empty dependency array means this runs once on mount


  // --- Update Status Function (Simulated) ---
  const updateStatus = async (id: number, status: "accepted" | "rejected") => {
    setError(null); // Clear previous errors
    console.log(`Simulating update for application ${id} to status: ${status}`);

    // Simulate API delay (optional)
    // await new Promise(resolve => setTimeout(resolve, 500));

    // Update local state directly
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );

    // Comment out the actual API call
    /*
    // Optimistic UI update (optional but improves perceived performance)
    const originalApplications = [...applications];
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );

    try {
      console.log(`Updating application ${id} to status: ${status}`);
      // API endpoint/route.ts]
      await axios.put(`/api/applications/${id}`, { status });
      // If successful, the optimistic update is correct.
    } catch (err) {
      console.error("Error updating status:", err);
      // Revert UI on error
      setApplications(originalApplications);
      setError(`Failed to update status for application ${id}. Please try again.`); // Show error
    }
    */
  };
  // --- End Update Status Function ---


  // --- Render Logic (Remains the same) ---
  if (loading) {
    return <p className={styles.feedbackText}>Loading applicants...</p>;
  }

  if (error && applications.length === 0) { // Show fetch error only if list is empty
      return <p className={`${styles.feedbackText} ${styles.errorText}`}>{error}</p>;
  }

  if (applications.length === 0) {
    return <p className={styles.feedbackText}>No applications found.</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Applicants</h1>

      {/* Display update error if it occurred */}
      {error && applications.length > 0 && (
           <p className={`${styles.feedbackText} ${styles.errorText} ${styles.updateError}`}>{error}</p>
      )}


      <div className={styles.applicationsList}>
        {applications.map((app) => (
          <div key={app.id} className={styles.applicationCard}>
            {/* Applicant Info */}
            <div className={styles.applicantInfo}>
              <p className={styles.applicantName}>{app.applicant.name}</p>
              <p className={styles.applicantEmail}>{app.applicant.email}</p>
              <p className={styles.hackathonName}>
                For: {app.hackathon.hackathonName}
              </p>

              {/* Display Skills */}
              <div className={styles.skillsContainer}>
                {app.applicantSkills && app.applicantSkills.length > 0 ? (
                  app.applicantSkills.map((skill, index) => (
                    <span key={index} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className={styles.noSkillsText}>No skills provided</p>
                )}
              </div>
            </div>

            {/* Actions / Status Display */}
            <div className={styles.actionArea}>
              {app.status === "pending" ? (
                <>
                  <Button
                    className={cn(styles.actionButton, styles.acceptButton)}
                    onClick={() => updateStatus(app.id, "accepted")}
                    size="sm"
                  >
                    Accept
                  </Button>
                  <Button
                    className={cn(styles.actionButton, styles.rejectButton)}
                    onClick={() => updateStatus(app.id, "rejected")}
                    size="sm"
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <span
                  className={cn(
                    styles.statusBadge,
                    app.status === "accepted" ? styles.statusAccepted : styles.statusRejected
                  )}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}