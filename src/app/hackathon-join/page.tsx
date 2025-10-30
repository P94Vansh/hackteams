// src/app/hackathon-join/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import styles from './hackathon-join.module.css'; // Import CSS Module
import { cn } from "@/lib/utils";
import Link from 'next/link';
// Import Button if needed (currently using standard button tags)
// import { Button } from "@/components/ui/button";

// Interface for the hackathon details (used by placeholder)
interface HackathonDetails {
    hackathonName: string;
    leader?: {
        id: number;
        name: string;
    };
    // Add other fields if needed
}

// Placeholder Data
const placeholderHackathonDetails: HackathonDetails = {
    hackathonName: "AI Innovation Challenge 2025 (Sample)",
    leader: {
        id: 101,
        name: "Alice Johnson (Sample Leader)"
    }
};
// End Placeholder Data

// Inner component to access searchParams
function HackathonApplicationFormInner() {
  const searchParams = useSearchParams();
  const hackathonId = searchParams.get("hackathonId"); // Still read ID for context

  // State for form data
  const [skills, setSkills] = useState<string[]>([]);
  const [coverNote, setCoverNote] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false); // For submission
  const [message, setMessage] = useState<string | null>(null);

  // --- State for Hackathon Details (using placeholder) ---
  const [hackathonDetails, setHackathonDetails] = useState<HackathonDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true); // Simulate loading briefly
  const [detailsError, setDetailsError] = useState<string | null>(null);
  // --- End State for Hackathon Details ---

  // --- Fetch Hackathon Details Function (Defined but commented out in useEffect) ---
  const fetchDetails = async () => {
      setDetailsLoading(true);
      setDetailsError(null);
      if (!hackathonId) {
          setDetailsError("Hackathon ID is missing in the URL.");
          setDetailsLoading(false);
          return;
      }
      try {
        // *** IMPORTANT: Replace with your actual API endpoint ***
        const res = await fetch(`/api/hackathon/${hackathonId}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Failed to fetch hackathon details (status ${res.status})`);
        }
        const data: HackathonDetails = await res.json();
        console.log(data)
        setHackathonDetails(data);
      } catch (error: any) {
        console.error("Error fetching hackathon details:", error);
        setDetailsError(error.message || "Could not load hackathon information.");
      } finally {
        setDetailsLoading(false);
      }
    };
  // --- End Fetch Hackathon Details ---

  // Load placeholder data in useEffect
  useEffect(() => {
    // --- Option 1: Use Placeholder Data (Active) ---
    // console.log("Using placeholder data for Hackathon ID:", hackathonId); // Log the ID being applied for
    // setHackathonDetails(placeholderHackathonDetails);
    // setDetailsLoading(false); // Stop loading after setting placeholder
    // setDetailsError(null); // Clear any errors
    // --- End Option 1 ---

    // --- Option 2: Use API Data (Comment out Option 1 and uncomment below) ---
    fetchDetails();
    // --- End Option 2 ---

  }, [hackathonId]); // Rerun if ID changes (though only placeholder loads)


  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // --- Submit Handler (Simulated) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Basic validation
    if (!hackathonId) {
        setMessage("❌ Hackathon ID is missing.");
        setLoading(false);
        return;
    }
    if (skills.length === 0) {
        setMessage("❌ Please add at least one skill.");
        setLoading(false);
        return;
    }

    console.log("Simulating application submission for Hackathon ID:", hackathonId);
    console.log("Skills:", skills);
    console.log("Cover Note:", coverNote);

    // Simulate API delay (optional)
    await new Promise(resolve => setTimeout(resolve, 750));

    // Simulate success
    setMessage("✅ Application submitted successfully! (Simulation)");
    setSkills([]);
    setCoverNote("");
    setSkillInput("");
    setLoading(false);

    // --- Original API Call Logic (Commented Out) ---
    try {
      const res = await fetch("/api/hackathonds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hackathonId: Number(hackathonId), skills, coverNote }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Application submitted successfully!");
        setSkills([]);
        setCoverNote("");
        setSkillInput("");
      } else {
        setMessage(`❌ ${data.error || "Something went wrong submitting the application"}`);
      }
    } catch (error) {
      console.error("Application submission error:", error);
      setMessage("❌ Failed to submit application due to a network or server error.");
    } finally {
      setLoading(false);
    }
    // --- End Original API Call Logic ---
  };
  // --- End Submit Handler ---

  const messageClass = message
    ? message.startsWith("✅")
      ? styles.successMessage
      : styles.errorMessage
    : '';

  return (
    <div className={styles.pageContainer}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.formTitle}>Apply to Join Team</h2>

            {/* Display Hackathon Name and Leader */}
            {detailsLoading && <p className={styles.loadingText}>Loading hackathon details...</p>}
            {detailsError && <p className={`${styles.errorMessage} ${styles.detailsError}`}>{detailsError}</p>}
            {hackathonDetails && (
                <div className={styles.hackathonInfoBox}>
                    Applying for: <span className={styles.hackathonName}>{hackathonDetails.hackathonName}</span>
                    {hackathonDetails.leader && (
                        <>
                            {' led by '}
                            <Link href={`/u/${hackathonDetails.leader.id}`} className={styles.leaderLink}>
                                {hackathonDetails.leader.name}
                            </Link>
                        </>
                    )}
                </div>
            )}

            {/* Skills Input Section */}
            <div className={styles.inputGroup}>
                <label htmlFor="skillInput" className={styles.label}>Your Skills</label>
                <div className={styles.skillAddContainer}>
                <input
                    id="skillInput"
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g., React)"
                    className={styles.skillInputField}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
                />
                <button
                    type="button"
                    onClick={addSkill}
                    className={styles.addButton}
                    disabled={!skillInput.trim()}
                >
                    Add
                </button>
                </div>
                {/* Display Added Skills */}
                <div className={styles.skillsDisplayContainer}>
                {skills.length === 0 ? (
                    <p className={styles.noSkillsText}>No skills added yet.</p>
                ) : (
                    skills.map((skill) => (
                        <span key={skill} className={styles.skillTag}>
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className={styles.removeSkillButton}
                            aria-label={`Remove ${skill}`}
                        >
                            &times;
                        </button>
                        </span>
                    ))
                )}
                </div>
            </div>

            {/* Cover Note Section */}
            <div className={styles.inputGroup}>
                <label htmlFor="coverNote" className={styles.label}>Cover Note (Why you?)</label>
                <textarea
                    id="coverNote"
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly explain why you'd be a good fit for the team..."
                    className={styles.textareaField}
                    rows={4}
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading || detailsLoading || !!detailsError || skills.length === 0}
                className={styles.submitButton}
            >
                {loading ? "Submitting..." : "Submit Application"}
            </button>

            {/* Feedback Message */}
            {message && <p className={`${styles.messageBase} ${messageClass}`}>{message}</p>}
        </form>
    </div>
  );
}

// Wrap with Suspense (remains the same)
export default function HackathonApplicationForm() {
    return (
        <Suspense fallback={<div className={styles.loadingFallback}>Loading form...</div>}>
            <HackathonApplicationFormInner />
        </Suspense>
    );
}