"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import styles from "./notifications.module.css";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Applicant {
  id: number;
  applicant: {
    id: number;
    name: string;
    email: string;
  };
  applicantSkills?: string[];
  status: string;
  hackathon: {
    hackathonName: string;
  };
}

interface MyApplication {
  id: number;
  status: string;
    hackathonName: string;
    teamName:string;
}

interface TeamStatus {
  hackathonName: string;
  teamName: string;
  statusMessage: string;
}

export default function ApplicantsPage() {
  const [leaderApplications, setLeaderApplications] = useState<Applicant[]>([]);
  const [myApplications, setMyApplications] = useState<MyApplication[]>([]);
  const [teamStatuses, setTeamStatuses] = useState<TeamStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch notifications (both perspectives)
  const fetchApplications = async () => {
    try {
      const res = await axios.get("/api/status");
      const data = res.data || {};
      console.log(res.data)
      setLeaderApplications(data.leaderApplications || []);
      setMyApplications(data.myApplications || []);
      setTeamStatuses(data.teamStatuses || []);
      console.log("Fetched Notifications:", data);
    } catch (err: any) {
      console.error("Error fetching applications:", err);
      setError(`Failed to load notifications: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ✅ Accept / Reject handler
  const updateStatus = async (id: number, status: "accepted" | "rejected") => {
    setError(null);
    const original = [...leaderApplications];

    // Optimistic update
    setLeaderApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );

    try {
      await axios.post(`/api/applications/${id}`, { status });
    } catch (err) {
      console.error("Error updating status:", err);
      setLeaderApplications(original);
      setError(`Failed to update status for application ${id}. Please try again.`);
    }
  };

  // --- Render Logic ---
  if (loading) {
    return <p className={styles.feedbackText}>Loading notifications...</p>;
  }

  if (
    error &&
    leaderApplications.length === 0 &&
    myApplications.length === 0 &&
    teamStatuses.length === 0
  ) {
    return <p className={`${styles.feedbackText} ${styles.errorText}`}>{error}</p>;
  }

  if (
    leaderApplications.length === 0 &&
    myApplications.length === 0 &&
    teamStatuses.length === 0
  ) {
    return <p className={styles.feedbackText}>No notifications found.</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Notifications</h1>

      {error && (
        <p className={`${styles.feedbackText} ${styles.errorText} ${styles.updateError}`}>
          {error}
        </p>
      )}

      {/* ✅ Section 1 — Requests You Received */}
      {leaderApplications.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Requests You Received</h2>
          <div className={styles.applicationsList}>
            {leaderApplications.map((app) => (
              <div key={app.id} className={styles.applicationCard}>
                <div className={styles.applicantInfo}>
                  <Link href={`/u/${app.applicant.id}`}>
                    <p className={styles.applicantName}>{app.applicant.name}</p>
                  </Link>
                  <p className={styles.applicantEmail}>{app.applicant.email}</p>
                  <p className={styles.hackathonName}>
                    For: {app.hackathon.hackathonName}
                  </p>

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
                        app.status === "accepted"
                          ? styles.statusAccepted
                          : styles.statusRejected
                      )}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ✅ Section 2 — Your Join Requests */}
      {myApplications.length > 0 && (
  <>
    <h2 className={styles.sectionTitle}>Your Join Requests</h2>
    <div className={styles.applicationsList}>
      {myApplications.map((app) => (
        <div key={app.id} className={styles.applicationCard}>
          <div className={styles.applicantInfo}>
            <p className={styles.hackathonName}>
              Hackathon: {app.hackathonName}
            </p>
            <p className={styles.teamName}>
              Team: {app.teamName}
            </p>
          </div>

          <div className={styles.actionArea}>
            <span
              className={cn(
                styles.statusBadge,
                app.status === "accepted"
                  ? styles.statusAccepted
                  : app.status === "rejected"
                  ? styles.statusRejected
                  : styles.statusPending
              )}
            >
              {app.status === "accepted" && (
                <>✅ {app.teamName} accepted your request</>
              )}
              {app.status === "rejected" && (
                <>❌ {app.teamName} rejected your request</>
              )}
              {app.status === "pending" && (
                <>⏳ Waiting for {app.teamName} to respond</>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  </>
)}


      {/* ✅ Section 3 — Team Responses (Accepted / Rejected) */}
      {teamStatuses.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Team Responses</h2>
          <div className={styles.applicationsList}>
            {teamStatuses.map((team, index) => (
              <div key={index} className={styles.applicationCard}>
                <div className={styles.applicantInfo}>
                  <p className={styles.hackathonName}>
                    {team.statusMessage}
                  </p>
                  <p className={styles.hackathonName}>
                    Hackathon: {team.hackathonName}
                  </p>
                  <p className={styles.hackathonName}>
                    Team: {team.teamName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
